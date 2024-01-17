package com.iforteam.deulsal_i.services;

import com.iforteam.deulsal_i.entities.*;
import com.iforteam.deulsal_i.enums.*;
import com.iforteam.deulsal_i.mappers.HomeMapper;
import com.iforteam.deulsal_i.models.PageModel;
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
import java.util.HashMap;

@Service
public class HomeService {
    public static final int PAGE_COUNT = 10;
    private final HomeMapper homeMapper;
    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine springTemplateEngine;


    @Autowired
    public HomeService(HomeMapper homeMapper, JavaMailSender javaMailSender, SpringTemplateEngine springTemplateEngine) {
        this.homeMapper = homeMapper;
        this.javaMailSender = javaMailSender;
        this.springTemplateEngine = springTemplateEngine;
    }

    // bookmark 서비스
    public HashMap<Integer, String> convertCategory(CampsiteEntity... campsites) {
        HashMap<Integer, String> result = new HashMap<>();
        for (CampsiteEntity campsite : campsites) {
            String cat = "";

            if (campsite.getGeneralCnt() > 0) {
                cat += "일반";
            }

            if (campsite.getAutoCnt() > 0) {
                if (!cat.isEmpty()) {
                    cat += " / ";
                }
                cat += "자동차";
            }

            if (campsite.getCaravanCnt() > 0) {
                if (!cat.isEmpty()) {
                    cat += " / ";
                }
                cat += "카라반";
            }

            if (campsite.getGlampingCnt() > 0) {
                if (!cat.isEmpty()) {
                    cat += " / ";
                }
                cat += "글램핑";
            }

            result.put(campsite.getIndex(), cat);
        }
        return result;
    }

    public int getTotalPosts(String userId) {
        return this.homeMapper.selectGetCountBySearchCriterion(userId);
    }

    public CampsiteEntity[] getCampsitesBookmarkPaged(String userId, PageModel pageModel) {
        return homeMapper.selectCampsitesBookmarkPaged(userId, pageModel);
    }

    // qna 서비스

    public QnaEntity[] getAllQnaByPage(PageModel pageModel, String userId) {
        return this.homeMapper.selectAllQnaByPage(pageModel, userId);
    }

    public QnaEntity[] getUserQnaByPage(PageModel pageModel, UserEntity user) {
        return this.homeMapper.selectUserQnaByPage(pageModel, user.getUserId());
    }


    public int getTotalPostsBookmark(String userId) {
        return this.homeMapper.getCampsitesBookmarkCount(userId);
    }


    public CampsiteEntity[] getCampsitesBookmark(String userId) {
        return homeMapper.selectCampsitesBookmark(userId);
    }

    public UserEntity getUserByUserId(String userId) {
        return homeMapper.selectUserByUserId(userId);
    }

    public UserEntity getUserByUserIdContact(String userId, String contact) {
        return homeMapper.selectUserByUserIdContact(userId, contact);
    }

    public UserRecoverContactCodeEntity postContactCodeSalt(UserRecoverContactCodeEntity contactCode) {
        if (contactCode == null || contactCode.getContact() == null || !contactCode.getContact().matches("^(010)(\\d{8})")){
            return null;
        }

        String code = RandomStringUtils.randomNumeric(6);
        String salt = CryptoUtil.hashSha512(String.format("%s%s%f%f",
                contactCode.getContact(),
                code,
                Math.random(),
                Math.random()));
        Date createdAt = new Date();
//        Context context = new Context();
//        context.setVariable("code", code);

        contactCode.setCode(code)
                .setSalt(salt)
                .setCreatedAt(createdAt)
                .setExpiresAt(DateUtils.addMinutes(createdAt, 5))
                .setExpired(false);

        NCloudUtil.sendSms(contactCode.getContact(), String.format("[Deulsal-E 회원정보수정] 인증번호 [%s]를 입력해 주세요.", contactCode.getCode()));

        if (homeMapper.insertContactCodeSalt(contactCode) > 0) {
            return contactCode;
        }
        return null;
    }

    public UserEntity postUserByContact(String contact){
        return homeMapper.selectUserByContact(contact);
    }

    public UserVerifyRecoverContactCodeResult postVerifyContactCodeSalt(UserRecoverContactCodeEntity contactCode) {
        contactCode = homeMapper.selectContactCodeSalt(contactCode);

        if (contactCode == null) {
            return UserVerifyRecoverContactCodeResult.FAILURE;
        }

        if (new Date().compareTo(contactCode.getExpiresAt()) > 0) {
            return UserVerifyRecoverContactCodeResult.FAILURE_EXPIRED;
        }

        if (homeMapper.deleteContactCodeSalt(contactCode) == 0) {
            return UserVerifyRecoverContactCodeResult.FAILURE;
        }

        return UserVerifyRecoverContactCodeResult.SUCCESS;
    }

    public UserModifyResult postModifyUserName(String userId, String name) {

        if (userId == null || name == null || !name.matches("^[가-힣]{2,10}$")){
            return UserModifyResult.FAILURE;
        }

        UserEntity user = homeMapper.selectUserByUserId(userId);
        if (user == null) {
            return UserModifyResult.FAILURE_NOT_FOUND_USER;
        }

        return homeMapper.updateUserByUserId(user.setName(name)) > 0
                ? UserModifyResult.SUCCESS
                : UserModifyResult.FAILURE;
    }

    public UserModifyResult postModifyUserPassword(String userId, String password) {

        if (userId == null || password == null || !password.matches(("^([\\da-zA-Z`~!@#$%^&*()\\-_=+\\[{\\]};:'\",<.>/?]{8,50})$"))) {
            return null;
        }

        UserEntity modifyUser = homeMapper.selectUserByUserId(userId);
        if (modifyUser == null) {
            return null;
        }
        return homeMapper.updateUserByUserId(modifyUser.setPassword((CryptoUtil.hashSha512(password)))) > 0 ? UserModifyResult.SUCCESS : UserModifyResult.FAILURE;
    }

    public UserModifyResult postModifyUserNickname(String userId, String nickname) {
        if (nickname == null || !nickname.matches("^([가-힣a-zA-Z0-9_-]{2,20})$")) {
            return UserModifyResult.FAILURE;
        }

        if (homeMapper.selectUserByNickname(nickname) != null){
            return UserModifyResult.FAILURE;
        }

        UserEntity user = homeMapper.selectUserByUserId(userId);

        if (user == null) {
            return UserModifyResult.FAILURE_NOT_FOUND_USER;
        }

        return homeMapper.updateUserByUserId(user.setNickname(nickname)) > 0 ? UserModifyResult.SUCCESS : UserModifyResult.FAILURE;
    }

    public UserModifyResult postModifyUserContact(String userId, String contact) {

        if (contact == null || !contact.matches("^(010)(\\d{8})$")) {
            return UserModifyResult.FAILURE;
        }
        if (homeMapper.selectUserByContact(contact)!=null){
            return UserModifyResult.FAILURE;
        }

        UserEntity user = homeMapper.selectUserByUserId(userId);

        if (user == null) {
            return UserModifyResult.FAILURE_NOT_FOUND_USER;
        }

        return homeMapper.updateUserByUserId(user.setContact(contact)) > 0 ? UserModifyResult.SUCCESS : UserModifyResult.FAILURE;
    }

    public UserRecoverEmailCodeEntity postEmailCodeSalt(UserRecoverEmailCodeEntity emailCode) throws MessagingException {

        if (emailCode.getEmail() == null || !emailCode.getEmail().matches("^(?=.{10,50}$)([\\da-zA-Z\\-_\\.]{5,25})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2})?$")) {
            return null;
        }

        String code = RandomStringUtils.randomNumeric(6);
        String salt = CryptoUtil.hashSha512(String.format("%s%s%f%f",
                emailCode.getEmail(),
                code,
                Math.random(),
                Math.random()));
        Date createdAt = new Date();
        Date expiresAt = DateUtils.addMinutes(createdAt, 5);
        Context context = new Context();
        context.setVariable("code", code);

        emailCode.setCode(code)
                .setSalt(salt)
                .setCreatedAt(createdAt)
                .setExpiresAt(expiresAt)
                .setExpired(false);


//        // 이메일을 생성하고 전송합니다.
        MimeMessage mimeMessage = this.javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        mimeMessageHelper.setSubject("[Deusal-E 이메일 변경] 이메일 인증");
        mimeMessageHelper.setFrom("inst.a01039222748@gmail.com"); // 당신 이메일
        mimeMessageHelper.setTo(emailCode.getEmail());
        mimeMessageHelper.setText(this.springTemplateEngine.process("home/_newEmail", context), true);
        this.javaMailSender.send(mimeMessage);

        // 복구 이메일 코드 정보를 데이터베이스에 저장하고 결과를 반환합니다.
        return this.homeMapper.insertEmailCodeSalt(emailCode) > 0
                ? emailCode : null;
    }

    public UserVerifyRecoverEmailCodeResult postVerifyEmailCodeSalt(UserRecoverEmailCodeEntity emailCode) {
        emailCode = homeMapper.selectEmailCodeSalt(emailCode);

        if (emailCode == null) {
            return UserVerifyRecoverEmailCodeResult.FAILURE;
        }

        if (new Date().compareTo(emailCode.getExpiresAt()) > 0) {
            return UserVerifyRecoverEmailCodeResult.FAILURE_EXPIRED;
        }

        if (homeMapper.deleteEmailCodeSalt(emailCode) == 0) {
            return UserVerifyRecoverEmailCodeResult.FAILURE;
        }

        return UserVerifyRecoverEmailCodeResult.SUCCESS;
    }

    public UserModifyResult postModifyUserEmail(String userId, String email) {

        if (email == null || !email.matches("^(?=.{10,50}$)([\\da-zA-Z\\-_\\.]{5,25})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2})?$")) {
            return UserModifyResult.FAILURE;
        }

        UserEntity user = homeMapper.selectUserByUserId(userId);

        if (user == null) {
            return UserModifyResult.FAILURE_NOT_FOUND_USER;
        }

        return homeMapper.updateUserEmail(user.setEmail(email)) > 0 ? UserModifyResult.SUCCESS : UserModifyResult.FAILURE;
    }

    public ReservationCampsiteEntity[] getReservation(int userIndex, PageModel pageModel){
        return this.homeMapper.selectReservationCampsiteByUserIndex(userIndex, pageModel);
    }

    public int getReservationCount(int userIndex){
        return this.homeMapper.selectReservationCountByUserIndex(userIndex);
    }

    public boolean[] judgmentCancellable(ReservationCampsiteEntity[] reservations){
        boolean[] isCancellable = new boolean[reservations.length];
        Date now = new Date();
        for (int i = 0; i < reservations.length; i++) {
            isCancellable[i] = now.compareTo(reservations[i].getStartDay()) > 0;
        }
        return isCancellable;
    }

    public CampsiteEntity[] getCampsiteSearchQuery(String query, int campsiteType){
        return this.homeMapper.selectCampsiteBySearchQuery(query, campsiteType);
    }

    public int getCampsiteSearchCountQuery(String query, int campsiteType){
        return this.homeMapper.selectCampsiteCountBySearchQuery(query, campsiteType);
    }

    public NoticeEntity[] getNoticeSearchQuery(String query){
        return this.homeMapper.selectNoticeBySearchQuery(query);
    }

    public int getNoticeCountSearchQuery(String query){
        return this.homeMapper.selectNoticeCountBySearchQuery(query);
    }

    public EventEntity[] getEventSearchQuery(String query){
        return this.homeMapper.selectEventBySearchQuery(query);
    }

    public int getEventCountSearchQuery(String query){
        return this.homeMapper.selectEventCountBySearchQuery(query);
    }

    public CampsiteImageEntity getCampsiteImg(int campsiteIndex){
        return this.homeMapper.selectCampsiteImage(campsiteIndex);
    }

    public EventEntity[] getEvent(){
        return this.homeMapper.selectEvent();
    }

    public NoticeEntity[] getNotice(){
        return this.homeMapper.selectNotice();
    }

    public UserEntity[] getUser(PageModel pageModel, String searchCriterion){
        return this.homeMapper.selectUser(pageModel, searchCriterion);
    }

    public int getUserCount(String searchCriterion){
        return this.homeMapper.selectUserCount(searchCriterion);
    }

    public boolean deleteUser(int index){
        return this.homeMapper.deleteUser(index) > 0;
    }

    public CampsiteEntity[] getCampsite(PageModel pageModel, String searchCriterion){
        return this.homeMapper.selectCampsite(pageModel,searchCriterion);
    }

    public int getCampsiteCount(String searchCriterion){
        return this.homeMapper.selectCampsiteCount(searchCriterion);
    }

    public boolean deleteCampsite(int index){
        return this.homeMapper.deleteCampsite(index) > 0;
    }

    public QnaEntity[] getQna(PageModel pageModel,String searchCriterion){
        return this.homeMapper.selectQna(pageModel,searchCriterion);
    }

    public int getQnaCount(String searchCriterion){
        return this.homeMapper.selectQnaCount(searchCriterion);
    }

    public EventEntity[] getEvent(PageModel pageModel,String searchCriterion){
        return this.homeMapper.selectEventAll(pageModel,searchCriterion);
    }

    public boolean deleteEvent(int index){
        return this.homeMapper.deleteEvent(index) > 0;
    }

    public int getEventCount(String searchCriterion){
        return this.homeMapper.selectEventCount(searchCriterion);
    }
}
