package com.iforteam.deulsal_i.services;

import com.iforteam.deulsal_i.entities.UserEntity;
import com.iforteam.deulsal_i.entities.UserRecoverContactCodeEntity;
import com.iforteam.deulsal_i.entities.UserRecoverEmailCodeEntity;
import com.iforteam.deulsal_i.entities.UserRegisterContactCodeEntity;
import com.iforteam.deulsal_i.enums.*;
import com.iforteam.deulsal_i.mappers.UserMapper;
import com.iforteam.deulsal_i.utils.CryptoUtil;
import com.iforteam.deulsal_i.utils.NCloudUtil;
import org.apache.catalina.User;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.Date;
import java.util.Objects;

@Service
public class UserService {
    private final UserMapper userMapper;
    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine springTemplateEngine;

    @Autowired
    public UserService(UserMapper userMapper, JavaMailSender javaMailSender, SpringTemplateEngine springTemplateEngine) {
        this.userMapper = userMapper;
        this.javaMailSender = javaMailSender;
        this.springTemplateEngine = springTemplateEngine;
    }

    // 회원가입시 휴대폰 확인 및 인증코드 전송기능
    public UserSendRegisterContactCodeResult sendRegisterContactCode(UserRegisterContactCodeEntity UserRegisterContactCode) {
        if (UserRegisterContactCode == null ||
                UserRegisterContactCode.getContact() == null ||
                !UserRegisterContactCode.getContact().matches("^(010)(\\d{8})$")) {
            return UserSendRegisterContactCodeResult.FAILURE;
        }
        if (this.userMapper.selectUserByContact(UserRegisterContactCode.getContact()) != null) {
            return UserSendRegisterContactCodeResult.FAILURE_DUPLICATE;
        }
        String code = RandomStringUtils.randomNumeric(6);
        String salt = CryptoUtil.hashSha512(String.format("%s%s%f%f",
                UserRegisterContactCode.getContact(),
                code,
                Math.random(),
                Math.random()));
        Date createdAt = new Date();
        Date expiresAt = DateUtils.addMinutes(createdAt, 5);
        UserRegisterContactCode.setCode(code)
                .setSalt(salt)
                .setCreatedAt(createdAt)
                .setExpiresAt(expiresAt)
                .setExpired(false);
        NCloudUtil.sendSms(UserRegisterContactCode.getContact(), String.format("[Deulsal-E 회원가입] 인증번호 [%s]를 입력해 주세요.", UserRegisterContactCode.getCode()));
        return this.userMapper.insertRegisterContactCode(UserRegisterContactCode) > 0
                ? UserSendRegisterContactCodeResult.SUCCESS
                : UserSendRegisterContactCodeResult.FAILURE;
    }

    // 회원가입 기능
    public UserRegisterResult register(UserEntity user,
                                       UserRegisterContactCodeEntity registerContactCode) throws MessagingException {

        // id 중복 확인
        if (this.userMapper.selectUserById(user.getUserId()) != null) {
            return UserRegisterResult.FAILURE_DUPLICATE_ID; // 중복된 id
        }

        // 이메일 중복 확인
        if (this.userMapper.selectUserByEmail(user.getEmail()) != null) {
            return UserRegisterResult.FAILURE_DUPLICATE_EMAIL; // 중복된 이메일
        }

        // 연락처 중복 확인
        if (this.userMapper.selectUserByContact(user.getContact()) != null) {
            return UserRegisterResult.FAILURE_DUPLICATE_CONTACT; // 중복된 연락처
        }

        // 닉네임 중복 확인
        if (this.userMapper.selectUserByNickname(user.getNickname()) != null) {
            return UserRegisterResult.FAILURE_DUPLICATE_NICKNAME; // 중복된 닉네임
        }

        // 등록된 연락처 코드 확인
        registerContactCode = this.userMapper.selectRegisterContactCodeByContactCodeSalt(registerContactCode);
        if (registerContactCode == null || !registerContactCode.isExpired()) {
            return UserRegisterResult.FAILURE; // 연락처 코드 확인 실패
        }

        // 비밀번호 해싱
        user.setPassword((CryptoUtil.hashSha512(user.getPassword())));
        user.setStatus(1);
        // 사용자의 상태를 1로 설정하며, 사용자의 관리자 권한을 개인으로 설정하는 부분
        // 사용자 등록 시 비밀번호를 보안적으로 처리하고, 이메일 인증이 완료되기 전까지 사용자의 상태를 대기 상태로 설정하는 역할

        // 사용자 등록
        return this.userMapper.insertUser(user) > 0
                ? UserRegisterResult.SUCCESS
                : UserRegisterResult.FAILURE;
    }

    // 회원가입시 휴대폰 인증 기능
    public UserVerifyRegisterContactCodeResult verifyRegisterContactCodeResult(UserRegisterContactCodeEntity registerContactCode) {
        UserRegisterContactCodeEntity existingRegisterContactCodeEntity = this.userMapper.selectRegisterContactCodeByContactCodeSalt(registerContactCode);
        if (existingRegisterContactCodeEntity == null) {
            return UserVerifyRegisterContactCodeResult.FAILURE;
            // 존재하지 않는 인증 코드일 경우 실패
        }
        Date currentDate = new Date();
        if (currentDate.compareTo(existingRegisterContactCodeEntity.getExpiresAt()) > 0) {
            return UserVerifyRegisterContactCodeResult.FAILURE_EXPIRED;
            // 인증 코드의 유효 기간이 지난 경우 실패
        }
        existingRegisterContactCodeEntity.setExpired(true); // 인증 코드를 사용한 것으로 표시하여 재사용을 방지
        return this.userMapper.updateRegisterContactCode(existingRegisterContactCodeEntity) > 0
                ? UserVerifyRegisterContactCodeResult.SUCCESS // 인증 코드 확인 및 업데이트 성공
                : UserVerifyRegisterContactCodeResult.FAILURE; // 인증 코드 업데이트 실패
    }

    // 회원가입시 아이디 확인
    public UserCheckIdResult userCheckId(String userId){
        return this.userMapper.selectUserById(userId) == null
                ? UserCheckIdResult.OKAY // 중복되지 않은 아이디인 경우 성공
                : UserCheckIdResult.DUPLICATE; // 이미 사용 중인 아이디인 경우 중복
    }

    // 회원가입시 닉네임 확인기능
    public UserCheckNicknameResult userCheckNickname(String nickname){
        return this.userMapper.selectUserByNickname(nickname) == null
                ? UserCheckNicknameResult.OKAY // 중복되지 않은 닉네임인 경우 성공
                : UserCheckNicknameResult.DUPLICATE; // 이미 사용 중인 닉네임인 경우 중복
    }

    // 비밀번호용 리커버 휴대폰 인증 코드 전송
    public UserSendRecoverContactCodeResult userSendRecoverContactCodeResult(UserRecoverContactCodeEntity recoverContactCode,
                                                                             UserEntity user) {
        // 복구 연락처 코드의 유효성을 검사합니다.
        if (recoverContactCode == null ||
                recoverContactCode.getContact() == null ||
                !recoverContactCode.getContact().matches("^(010)(\\d{8})$")) {
            return UserSendRecoverContactCodeResult.FAILURE;
        }

        // 해당 아이디와 연락처로 유저 정보를 조회합니다.
        UserEntity existingUser = this.userMapper.selectUserByIdAndContact(user.getUserId(), user.getContact());
        if (existingUser == null || !existingUser.getContact().equals(user.getContact()) || !existingUser.getUserId().equals(user.getUserId())) {
            return UserSendRecoverContactCodeResult.FAILURE_NO_USERS;
        }
        // 복구 연락처 코드의 유효성 검사를 통과한 경우, 해당 연락처로 등록된 사용자가 존재하는지 확인합니다.
        if (this.userMapper.selectUserByContact(recoverContactCode.getContact()) == null) {
            return UserSendRecoverContactCodeResult.FAILURE;
        }

        // 인증번호 생성
        String code = RandomStringUtils.randomNumeric(6);
        // 솔트 생성
        String salt = CryptoUtil.hashSha512(String.format("%s%s%f%f",
                recoverContactCode.getContact(),
                code,
                Math.random(),
                Math.random()));
        // 생성 및 만료 일시 설정
        Date createdAt = new Date();
        Date expiresAt = DateUtils.addMinutes(createdAt, 5);
        // recoverContactCode 객체에 인증번호, 솔트, 생성 및 만료 일시 등을 설정합니다.
        recoverContactCode.setCode(code)
                .setSalt(salt)
                .setCreatedAt(createdAt)
                .setExpiresAt(expiresAt)
                .setExpired(false);
        // 생성한 인증번호를 해당 연락처로 SMS로 전송합니다.
        NCloudUtil.sendSms(recoverContactCode.getContact(), String.format("[Deusal-E 계정 복구] 인증번호 [%s]를 입력해주세요.", recoverContactCode.getCode()));

        // recoverContactCode를 데이터베이스에 저장하고 결과에 따라 성공 또는 실패 결과를 반환합니다.
        return this.userMapper.insertRecoverContactCode(recoverContactCode) > 0
                ? UserSendRecoverContactCodeResult.SUCCESS
                : UserSendRecoverContactCodeResult.FAILURE;
    }

    // 아이디용 리커버 휴대폰 인증 코드 전송
    public UserSendRecoverContactCodeResult userSendRecoverPasswordContactCodeResult(UserRecoverContactCodeEntity recoverContactCode,
                                                                             UserEntity user) {
        // 복구 연락처 코드의 유효성을 검사합니다.
        if (recoverContactCode == null ||
                recoverContactCode.getContact() == null ||
                !recoverContactCode.getContact().matches("^(010)(\\d{8})$")) {
            return UserSendRecoverContactCodeResult.FAILURE;
        }

        // 해당 아이디와 연락처로 유저 정보를 조회합니다.
        UserEntity existingUser = this.userMapper.selectUserByNameAndContact(user.getName(), user.getContact());
        if (existingUser == null || !existingUser.getContact().equals(user.getContact()) || !existingUser.getName().equals(user.getName())) {
            return UserSendRecoverContactCodeResult.FAILURE_NO_USERS;
        }
        // 복구 연락처 코드의 유효성 검사를 통과한 경우, 해당 연락처로 등록된 사용자가 존재하는지 확인합니다.
        if (this.userMapper.selectUserByContact(recoverContactCode.getContact()) == null) {
            return UserSendRecoverContactCodeResult.FAILURE;
        }

        // 인증번호 생성
        String code = RandomStringUtils.randomNumeric(6);
        // 솔트 생성
        String salt = CryptoUtil.hashSha512(String.format("%s%s%f%f",
                recoverContactCode.getContact(),
                code,
                Math.random(),
                Math.random()));
        // 생성 및 만료 일시 설정
        Date createdAt = new Date();
        Date expiresAt = DateUtils.addMinutes(createdAt, 5);
        // recoverContactCode 객체에 인증번호, 솔트, 생성 및 만료 일시 등을 설정합니다.
        recoverContactCode.setCode(code)
                .setSalt(salt)
                .setCreatedAt(createdAt)
                .setExpiresAt(expiresAt)
                .setExpired(false);
        // 생성한 인증번호를 해당 연락처로 SMS로 전송합니다.
        NCloudUtil.sendSms(recoverContactCode.getContact(), String.format("[Deusal-E 계정 복구] 인증번호 [%s]를 입력해주세요.", recoverContactCode.getCode()));

        // recoverContactCode를 데이터베이스에 저장하고 결과에 따라 성공 또는 실패 결과를 반환합니다.
        return this.userMapper.insertRecoverContactCode(recoverContactCode) > 0
                ? UserSendRecoverContactCodeResult.SUCCESS
                : UserSendRecoverContactCodeResult.FAILURE;
    }

    // 리커버 휴대폰 인증
    public UserVerifyRecoverContactCodeResult verifyRecoverContactCodeResult(UserRecoverContactCodeEntity recoverContactCode) {
        // 복구 연락처 코드를 검증하는 메소드입니다.
        // recoverContactCode 매개변수는 검증에 필요한 정보를 담고 있는 객체입니다.

        // 입력된 복구 연락처 코드에 해당하는 기존의 복구 연락처 코드 정보를 데이터베이스에서 조회합니다.
        UserRecoverContactCodeEntity existingRecoverContactCodeEntity = this.userMapper.selectRecoverContactCodeByContactCodeSalt(recoverContactCode);


        // 기존의 복구 연락처 코드 정보가 존재하지 않는 경우 실패 결과를 반환합니다.
        if (existingRecoverContactCodeEntity == null) {
            return UserVerifyRecoverContactCodeResult.FAILURE;
        }

        // 현재 일시와 복구 연락처 코드의 만료 일시를 비교하여 코드의 유효성을 확인합니다.
        if (new Date().compareTo(existingRecoverContactCodeEntity.getExpiresAt()) > 0) {
            return UserVerifyRecoverContactCodeResult.FAILURE_EXPIRED;
            // 코드가 만료된 경우 실패 결과를 반환합니다.
        }

        // 코드의 상태를 "expired"로 설정합니다.
        existingRecoverContactCodeEntity.setExpired(true);

        // 데이터베이스에서 코드의 상태를 업데이트하고 결과에 따라 성공 또는 실패 결과를 반환합니다.
        return this.userMapper.updateRecoverContactCode(existingRecoverContactCodeEntity) > 0
                ? UserVerifyRecoverContactCodeResult.SUCCESS
                : UserVerifyRecoverContactCodeResult.FAILURE;
    }

    // 연락처로 유저 조회
    public UserEntity getUserByContact(String contact) {
        // 연락처에 해당하는 사용자 정보를 조회하는 메소드입니다.
        // contact 매개변수는 조회할 사용자의 연락처입니다.

        // 데이터베이스에서 연락처에 해당하는 사용자 정보를 조회하여 반환합니다.
        return this.userMapper.selectUserByContact(contact);
    }

    // 이메일로 유저 조회
    public UserEntity getUserByEmail(String email) {
        // 이메일에 해당하는 사용자 정보를 조회하는 메소드입니다.
        // email 매개변수는 조회할 사용자의 연락처입니다.

        // 데이터베이스에서 연락처에 해당하는 사용자 정보를 조회하여 반환합니다.
        return this.userMapper.selectUserByEmail(email);
    }

    // 리커버 아이디 휴대폰으로 찾기
    public UserRecoverSelectUserIdResult userRecoverSelectUserPhoneCertId(UserEntity user) {
        UserEntity recoverUser = this.userMapper.selectUserByNameAndContact(user.getName(), user.getContact());
        if (recoverUser != null) {
            user.setUserId(recoverUser.getUserId());
            return UserRecoverSelectUserIdResult.SUCCESS;
        } else {
            return UserRecoverSelectUserIdResult.FAILURE;
        }
    }

    // 리커버 아이디 이메일로 찾기
    public UserRecoverSelectUserIdResult userRecoverSelectEmailCertUserId(UserEntity user) {
        UserEntity recoverUser = this.userMapper.selectUserByNameAndEmail(user.getName(), user.getEmail());
        if (recoverUser != null) {
            user.setUserId(recoverUser.getUserId());
            return UserRecoverSelectUserIdResult.SUCCESS;
        } else {
            return UserRecoverSelectUserIdResult.FAILURE;
        }
    }

    // 리커버 이메일 코드 확인
    public UserVerifyRecoverEmailCodeResult verifyRecoverEmailCodeResult(UserRecoverEmailCodeEntity recoverEmailCode) {
        // 복구 이메일 코드를 검증하는 메소드입니다.
        // recoverEmailCode 매개변수는 검증에 필요한 정보를 담고 있는 객체입니다.

        // 복구 이메일 코드 정보의 유효성을 검사합니다.
        if (recoverEmailCode == null ||
                recoverEmailCode.getEmail() == null ||
                recoverEmailCode.getCode() == null ||
                recoverEmailCode.getSalt() == null ||
                !recoverEmailCode.getEmail().matches("^(?=.{10,50}$)([\\da-zA-Z\\-_\\.]{5,25})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2})?$") ||
                !recoverEmailCode.getCode().matches("^([\\da-zA-Z]{6})$") ||
                !recoverEmailCode.getSalt().matches("^([\\da-f]{128})$")) {
            return UserVerifyRecoverEmailCodeResult.FAILURE;
        }

        // 입력된 복구 이메일 코드에 해당하는 기존의 복구 연락처 코드 정보를 데이터베이스에서 조회합니다.
        UserRecoverEmailCodeEntity existingRecoverEmailCodeEntity = this.userMapper.selectRecoverEmailCodeByEmailCodeSalt(recoverEmailCode);


        // 기존의 복구 이메일 코드 정보가 존재하지 않는 경우 실패 결과를 반환합니다.
        if (existingRecoverEmailCodeEntity == null) {
            return UserVerifyRecoverEmailCodeResult.FAILURE;
        }

        // 현재 일시와 복구 이메일 코드의 만료 일시를 비교하여 코드의 유효성을 확인합니다.
        if (new Date().compareTo(existingRecoverEmailCodeEntity.getExpiresAt()) > 0) {
            return UserVerifyRecoverEmailCodeResult.FAILURE_EXPIRED;
            // 코드가 만료된 경우 실패 결과를 반환합니다.
        }

        // 코드의 상태를 "expired"로 설정합니다.
        existingRecoverEmailCodeEntity.setExpired(true);

        // 데이터베이스에서 코드의 상태를 업데이트하고 결과에 따라 성공 또는 실패 결과를 반환합니다.
        return this.userMapper.updateRecoverEmailCode(existingRecoverEmailCodeEntity) > 0
                ? UserVerifyRecoverEmailCodeResult.SUCCESS
                : UserVerifyRecoverEmailCodeResult.FAILURE;
    }

    // 아이디용 리커버 이메일 코드 전송
    public UserSendRecoverEmailCodeResult userSendRecoverIdEmailCode(UserRecoverEmailCodeEntity recoverEmailCode,
                                                                     UserEntity user) throws MessagingException {
        // 복구 이메일 코드를 전송하는 메소드입니다.
        // recoverEmailCode 매개변수는 복구 이메일 코드 정보를 담고 있습니다.

        // 복구 이메일 코드와 이메일 주소의 유효성을 검사합니다.
        if (recoverEmailCode == null ||
                recoverEmailCode.getEmail() == null ||
                !recoverEmailCode.getEmail().matches("^(?=.{10,50}$)([\\da-zA-Z\\-_\\.]{5,25})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2})?$")) {
            return UserSendRecoverEmailCodeResult.FAILURE;
        }

        // 해당 아이디와 이메일로 유저 정보를 조회합니다.
        UserEntity existingUser = this.userMapper.selectUserByNameAndEmail(user.getName(), user.getEmail());
        if (existingUser == null || !existingUser.getEmail().equals(user.getEmail()) || !existingUser.getName().equals(user.getName())) {
            return UserSendRecoverEmailCodeResult.FAILURE_NO_USERS;
        }

        // 이메일 주소에 해당하는 사용자가 존재하는지 확인합니다.
        if (this.userMapper.selectUserByEmail(recoverEmailCode.getEmail()) == null) {
            return UserSendRecoverEmailCodeResult.FAILURE;
        }

        String code = RandomStringUtils.randomNumeric(6);
        String salt = CryptoUtil.hashSha512(String.format("%s%s%f%f",
                recoverEmailCode.getEmail(),
                code,
                Math.random(),
                Math.random()));
        Date createdAt = new Date();
        Date expiresAt = DateUtils.addMinutes(createdAt, 5);
        Context context = new Context();
        context.setVariable("code", code);

        recoverEmailCode.setCode(code)
                .setSalt(salt)
                .setCreatedAt(createdAt)
                .setExpiresAt(expiresAt)
                .setExpired(false);

        // 이메일을 생성하고 전송합니다.
        MimeMessage mimeMessage = this.javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        mimeMessageHelper.setSubject("[Deusal-E 계정 복구] 이메일 인증");
        mimeMessageHelper.setFrom("inst.a01039222748@gmail.com"); // 당신 이메일
        mimeMessageHelper.setTo(recoverEmailCode.getEmail());
        mimeMessageHelper.setText(this.springTemplateEngine.process("user/_recoverEmailCert", context), true);
        this.javaMailSender.send(mimeMessage);

        // 복구 이메일 코드 정보를 데이터베이스에 저장하고 결과를 반환합니다.
        return this.userMapper.insertRecoverEmailCode(recoverEmailCode) > 0
                ? UserSendRecoverEmailCodeResult.SUCCESS
                : UserSendRecoverEmailCodeResult.FAILURE;
    }

    // 비밀번호용 리커버 이메일 코드 전송
    public UserSendRecoverEmailCodeResult userSendRecoverEmailCode(UserRecoverEmailCodeEntity recoverEmailCode,
                                                                   UserEntity user) throws MessagingException {
        // 복구 이메일 코드를 전송하는 메소드입니다.
        // recoverEmailCode 매개변수는 복구 이메일 코드 정보를 담고 있습니다.

        // 복구 이메일 코드와 이메일 주소의 유효성을 검사합니다.
        if (recoverEmailCode == null ||
                recoverEmailCode.getEmail() == null ||
                !recoverEmailCode.getEmail().matches("^(?=.{10,50}$)([\\da-zA-Z\\-_\\.]{5,25})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2})?$")) {
            return UserSendRecoverEmailCodeResult.FAILURE;
        }

        // 해당 아이디와 이메일로 유저 정보를 조회합니다.
        UserEntity existingUser = this.userMapper.selectUserByIdAndEmail(user.getUserId(), user.getEmail());
        if (existingUser == null || !existingUser.getEmail().equals(user.getEmail()) || !existingUser.getUserId().equals(user.getUserId())) {
            return UserSendRecoverEmailCodeResult.FAILURE_NO_USERS;
        }

        // 이메일 주소에 해당하는 사용자가 존재하는지 확인합니다.
        if (this.userMapper.selectUserByEmail(recoverEmailCode.getEmail()) == null) {
            return UserSendRecoverEmailCodeResult.FAILURE;
        }

        String code = RandomStringUtils.randomNumeric(6);
        String salt = CryptoUtil.hashSha512(String.format("%s%s%f%f",
                recoverEmailCode.getEmail(),
                code,
                Math.random(),
                Math.random()));
        Date createdAt = new Date();
        Date expiresAt = DateUtils.addMinutes(createdAt, 5);
        Context context = new Context();
        context.setVariable("code", code);

        recoverEmailCode.setCode(code)
                .setSalt(salt)
                .setCreatedAt(createdAt)
                .setExpiresAt(expiresAt)
                .setExpired(false);

        // 이메일을 생성하고 전송합니다.
        MimeMessage mimeMessage = this.javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        mimeMessageHelper.setSubject("[Deusal-E 계정 복구] 이메일 인증");
        mimeMessageHelper.setFrom("inst.a01039222748@gmail.com"); // 당신 이메일
        mimeMessageHelper.setTo(recoverEmailCode.getEmail());
        mimeMessageHelper.setText(this.springTemplateEngine.process("user/_recoverEmailCert", context), true);
        this.javaMailSender.send(mimeMessage);

        // 복구 이메일 코드 정보를 데이터베이스에 저장하고 결과를 반환합니다.
        return this.userMapper.insertRecoverEmailCode(recoverEmailCode) > 0
                ? UserSendRecoverEmailCodeResult.SUCCESS
                : UserSendRecoverEmailCodeResult.FAILURE;
    }

    // 비밀번호 재설정
    public UserResetPasswordResult resetPassword(UserEntity user) {

        // 입력한 비밀번호 저장
        String password = user.getPassword();

        if (password == null) {
            System.out.println(124124);
            return UserResetPasswordResult.FAILURE;
        }

        // 사용자 정보를 데이터베이스에서 조회합니다.
        UserEntity existingUser = this.userMapper.selectUserById(user.getUserId());
        if (existingUser == null) {
            System.out.println(52352);
            return UserResetPasswordResult.FAILURE_NO_USERS;
        }

        // 사용자의 비밀번호를 해시 처리합니다.
        String newPassword = CryptoUtil.hashSha512(password);
        existingUser.setPassword(newPassword);

        // 사용자 정보를 업데이트.
        return this.userMapper.updateUser(existingUser) > 0
                ? UserResetPasswordResult.SUCCESS
                : UserResetPasswordResult.FAILURE;

    }

    // 로그인
    public UserLoginResult login(UserEntity user) {

        // 비밀번호 유효성 검사 ㄱㄱ
        if (user.getPassword() == null ||
                !user.getPassword().matches("^([\\da-zA-Z`~!@#$%^&*()\\-_=+\\[{\\]};:'\",<.>/?]{8,50})$")) {
            return UserLoginResult.FAILURE;
        }

        UserEntity existingUser = this.userMapper.selectUserById(user.getUserId());
        if (existingUser == null) {
            return UserLoginResult.FAILURE;
            // 해당 이메일로 등록된 사용자가 없음
        }

        String hashedPassword = CryptoUtil.hashSha512(user.getPassword());
        if (!hashedPassword.equals(existingUser.getPassword())) {
            return UserLoginResult.FAILURE;
            // 비밀번호가 일치하지 않음
        }

        // 권한이 다를때
        if (existingUser.getAuthority() != 0 && !Objects.equals(user.getAuthority(), existingUser.getAuthority())) {
            return UserLoginResult.FAILURE_AUTHORITY;
        }

        user.setNickname(existingUser.getNickname())
                .setContact(existingUser.getContact())
                .setName(existingUser.getName())
                .setUserId(existingUser.getUserId())
                .setStatus(existingUser.getStatus())
                .setAuthority(existingUser.getAuthority())
                .setCreatedAt(existingUser.getCreatedAt())
                .setIndex(existingUser.getIndex());

        if (user.getAuthority() == 0) {
            return UserLoginResult.SUCCESS; // 관리자 권한이면 무조건 "SUCCESS" 반환
        }

        if (user.getStatus() == 0){
            return UserLoginResult.FAILURE; // 계정이 삭제됨
        }
        if (user.getStatus() == 2){
            return UserLoginResult.FAILURE_DORMANT; // 휴면계정
        }

        if (user.getAuthority() == 2) {
            return UserLoginResult.SUCCESS_BUSINESS;
        }

        return UserLoginResult.SUCCESS;
    }



}
