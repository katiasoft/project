package com.iforteam.deulsal_i.controllers;

import com.iforteam.deulsal_i.entities.UserEntity;
import com.iforteam.deulsal_i.entities.UserRecoverContactCodeEntity;
import com.iforteam.deulsal_i.entities.UserRecoverEmailCodeEntity;
import com.iforteam.deulsal_i.entities.UserRegisterContactCodeEntity;
import com.iforteam.deulsal_i.enums.*;
import com.iforteam.deulsal_i.mappers.UserMapper;
import com.iforteam.deulsal_i.services.UserService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.mail.MessagingException;
import javax.servlet.http.HttpSession;

@Controller
@RequestMapping(value = "/user")
public class UserController {

    private final UserService userService;
    @Autowired //스프링 프레임워크에서 의존성 주입(Dependency Injection)을 수행하기 위해 사용
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // login, recover, register modelAndView
    @RequestMapping(value = "/login",
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getIndex() {
        ModelAndView modelAndView = new ModelAndView("user/login");
        return modelAndView;
    }
    @RequestMapping(value = "/recover",
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getRecover() {
        ModelAndView modelAndView = new ModelAndView("user/recover");
        return modelAndView;
    }
    @RequestMapping(value = "/register",
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getRegister() {
        ModelAndView modelAndView = new ModelAndView("user/register");
        return modelAndView;
    }
    // 여기까지


    @RequestMapping(value = "register",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postRegister(UserEntity user,
                               UserRegisterContactCodeEntity userRegisterContactCode) throws MessagingException {
        UserRegisterResult result = this.userService.register(user, userRegisterContactCode);
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        return responseObject.toString();
    }

    // 아이디 중복확인
    @RequestMapping(value = "userIdCount",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getUserIdCount(@RequestParam(value = "userId") String userId) {

        UserCheckIdResult result = this.userService.userCheckId(userId);
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        return responseObject.toString();
    }

    // 닉네임 중복확인
    @RequestMapping(value = "userNicknameCount",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getUserNicknameCount(@RequestParam(value = "nickname") String nickname) {

        UserCheckNicknameResult result = this.userService.userCheckNickname(nickname);
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        return responseObject.toString();
    }

    // 연락처 인증 확인
    @RequestMapping(value = "contactCode",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getContactCode(UserRegisterContactCodeEntity UserRegisterContactCode) {

        UserSendRegisterContactCodeResult result = this.userService.sendRegisterContactCode(UserRegisterContactCode);
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());// 결과 값 설정
        }};
        if (result == UserSendRegisterContactCodeResult.SUCCESS) {
            responseObject.put("salt", UserRegisterContactCode.getSalt());
        }

        return responseObject.toString();
    }


    @RequestMapping(value = "contactCode",
            method = RequestMethod.PATCH,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchContactCode(UserRegisterContactCodeEntity registerContactCodeEntity) {
        UserVerifyRegisterContactCodeResult result = this.userService.verifyRegisterContactCodeResult(registerContactCodeEntity);
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        return responseObject.toString();
    }

    // 휴대폰 인증번호 확인하기
    @RequestMapping(value = "/contactCodeRec",
            method = RequestMethod.PATCH,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchContactCode(UserRecoverContactCodeEntity recoverContactCode) {
        UserVerifyRecoverContactCodeResult result = this.userService.verifyRecoverContactCodeResult(recoverContactCode);
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        if (result == UserVerifyRecoverContactCodeResult.SUCCESS) {
            UserEntity user = userService.getUserByContact(recoverContactCode.getContact());
            responseObject.put("email", user.getEmail());
        }
        return responseObject.toString();
    }

    // 비밀번호용 휴대폰 인증번호 보내기
    @RequestMapping(value = "/contactCodeRec",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getContactCodeRec(@ModelAttribute UserRecoverContactCodeEntity recoverContactCode,
                                    @ModelAttribute UserEntity user) {

        // 복구 연락처 코드 객체를 생성하고 필요한 정보를 설정합니다.
        UserRecoverContactCodeEntity recoverContactCodeEntity = new UserRecoverContactCodeEntity();
        recoverContactCodeEntity.setContact(user.getContact());

        UserSendRecoverContactCodeResult result = this.userService.userSendRecoverContactCodeResult(recoverContactCodeEntity, user);

        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        if (result == UserSendRecoverContactCodeResult.SUCCESS) {
            responseObject.put("salt", recoverContactCodeEntity.getSalt());
        }
        return responseObject.toString();
    }

    // 비밀번호용 휴대폰 인증번호 보내기
    @RequestMapping(value = "/contactCodeRec/id",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getPasswordContactCodeRec(@ModelAttribute UserRecoverContactCodeEntity recoverContactCode,
                                            @ModelAttribute UserEntity user) {

        // 복구 연락처 코드 객체를 생성하고 필요한 정보를 설정합니다.
        UserRecoverContactCodeEntity recoverContactCodeEntity = new UserRecoverContactCodeEntity();
        recoverContactCodeEntity.setContact(user.getContact());

        UserSendRecoverContactCodeResult result = this.userService.userSendRecoverPasswordContactCodeResult(recoverContactCodeEntity, user);

        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        if (result == UserSendRecoverContactCodeResult.SUCCESS) {
            responseObject.put("salt", recoverContactCodeEntity.getSalt());
        }
        return responseObject.toString();
    }


    // 휴대폰 인증후 아이디찾기
    @RequestMapping(value = "selectPhoneCertId",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getRecoverPhoneCertById(UserEntity user) {
        UserRecoverSelectUserIdResult result = this.userService.userRecoverSelectUserPhoneCertId(user);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        if (result == UserRecoverSelectUserIdResult.SUCCESS) {
            responseObject.put("userId", user.getUserId());
        }
        return responseObject.toString();
    }

    // 이메일 인증후 아이디찾기
    @RequestMapping(value = "selectEmailCertId",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getRecoverEmailCertById(UserEntity user) {
        UserRecoverSelectUserIdResult result = this.userService.userRecoverSelectEmailCertUserId(user);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        if (result == UserRecoverSelectUserIdResult.SUCCESS) {
            responseObject.put("userId", user.getUserId());
        }
        return responseObject.toString();
    }

    // 아이디용 이메일 인증 보내기
    @RequestMapping(value = "/emailCodeRec/id",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getRecoverIdPassword(@ModelAttribute UserRecoverEmailCodeEntity recoverEmailCode,
                                       @ModelAttribute UserEntity user) throws MessagingException {

        // UserEntity 객체를 생성하여 이메일 주소를 설정합니다.
        UserEntity userEntity = new UserEntity()
                .setEmail(user.getEmail());

        // 서비스 메서드를 호출합니다.
        UserSendRecoverEmailCodeResult result = this.userService.userSendRecoverIdEmailCode(recoverEmailCode, user);

        // 결과를 JSON 형태로 반환합니다.
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        if (result == UserSendRecoverEmailCodeResult.SUCCESS) {
            responseObject.put("salt", recoverEmailCode.getSalt());
        }
        return responseObject.toString();
    }

    // 비밀번호용 이메일 인증 보내기
    @RequestMapping(value = "/emailCodeRec",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getRecoverPassword(@ModelAttribute UserRecoverEmailCodeEntity recoverEmailCode,
                                     @ModelAttribute UserEntity user) throws MessagingException {

        // UserEntity 객체를 생성하여 이메일 주소를 설정합니다.
        UserEntity userEntity = new UserEntity()
                .setEmail(user.getEmail());

        // 서비스 메서드를 호출합니다.
        UserSendRecoverEmailCodeResult result = this.userService.userSendRecoverEmailCode(recoverEmailCode, user);

        // 결과를 JSON 형태로 반환합니다.
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        if (result == UserSendRecoverEmailCodeResult.SUCCESS) {
            responseObject.put("salt", recoverEmailCode.getSalt());
        }
        return responseObject.toString();
    }

    // 이메일 인증보내기
    @RequestMapping(value = "/emailCodeRec",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postRecoverPassword(@ModelAttribute UserRecoverEmailCodeEntity recoverEmailCode,
                                      @ModelAttribute UserEntity user) throws MessagingException {

        // UserEntity 객체를 생성하여 이메일 주소를 설정합니다.
        UserEntity userEntity = new UserEntity()
                .setEmail(user.getEmail())
                .setUserId(user.getUserId());

        // 서비스 메서드를 호출합니다.
        UserSendRecoverEmailCodeResult result = this.userService.userSendRecoverEmailCode(recoverEmailCode, userEntity);

        // 결과를 JSON 형태로 반환합니다.
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        return responseObject.toString();
    }

    // 이메일 인증번호 확인하기
    @RequestMapping(value = "/emailCodeRec",
            method = RequestMethod.PATCH,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchEmailCode(UserRecoverEmailCodeEntity recoverEmailCode) {
        UserVerifyRecoverEmailCodeResult result = this.userService.verifyRecoverEmailCodeResult(recoverEmailCode);
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        if (result == UserVerifyRecoverEmailCodeResult.SUCCESS) {
            UserEntity user = userService.getUserByEmail(recoverEmailCode.getEmail());
            responseObject.put("email", user.getEmail());
        }
        return responseObject.toString();
    }

    // 인증 후 비밀번호 재설정
    @RequestMapping(value = "resetPassword",
            method = RequestMethod.PATCH,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchResetPassword(UserEntity user) {
        UserResetPasswordResult result = this.userService.resetPassword(user);
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        return responseObject.toString();
    }


    // login
    @RequestMapping(value = "login",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postLogin(HttpSession session, UserEntity user) {
        UserLoginResult result = this.userService.login(user);
        if (result == UserLoginResult.SUCCESS || result == UserLoginResult.SUCCESS_BUSINESS) {
            session.setAttribute("user", user);
        }
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    // logout
    @RequestMapping(value = "logout",
            method = RequestMethod.GET)
    public ModelAndView getLogout(HttpSession session) {
        ModelAndView modelAndView = new ModelAndView("redirect:/");
        session.setAttribute("user", null);
        return modelAndView;
    }

}
