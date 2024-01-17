package com.iforteam.deulsal_i.controllers;

import com.iforteam.deulsal_i.entities.CampsiteEntity;
import com.iforteam.deulsal_i.entities.*;
import com.iforteam.deulsal_i.enums.MyPageEmailCodeResult;
import com.iforteam.deulsal_i.enums.UserModifyResult;
import com.iforteam.deulsal_i.enums.UserSendRecoverEmailCodeResult;
import com.iforteam.deulsal_i.enums.UserVerifyRecoverEmailCodeResult;
import com.iforteam.deulsal_i.models.PageModel;
import com.iforteam.deulsal_i.services.EntrepreneurService;
import com.iforteam.deulsal_i.services.HelpService;
import com.iforteam.deulsal_i.services.HomeService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.mail.MessagingException;
import javax.servlet.http.HttpSession;
import java.time.LocalDate;
import java.util.*;

@Controller
@RequestMapping(value = "/")
public class HomeController {

    private final HomeService homeService;

    @Autowired
    public HomeController(HomeService homeService) {
        this.homeService = homeService;
    }

    // home, mypage ModelAndView
    @RequestMapping(value = "/",
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getIndex() {
        ModelAndView modelAndView = new ModelAndView("home/index");

        EventEntity[] events = this.homeService.getEvent();
        NoticeEntity[] notices = this.homeService.getNotice();

        modelAndView.addObject("events", events);
        modelAndView.addObject("notices", notices);

        return modelAndView;
    }

    @RequestMapping(value = "/entrepreneur", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getRegistration(@SessionAttribute(value = "user", required = false) UserEntity user) {
        ModelAndView modelAndView = new ModelAndView();
//        if (user == null){
//            modelAndView.setViewName("redirect:/user/login");
//        } else {
        modelAndView.setViewName("/home/entrepreneur");
        NoticeEntity[] notices = this.homeService.getNotice();
        modelAndView.addObject("notices", notices);
//        }
        return modelAndView;
    }

    @RequestMapping(value = "/mypage/modify",
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getMyPageModify(
            HttpSession session) {

//        if (session.getAttribute("user") == null){
//            return new ModelAndView("redirect:/user/login");
//        }
        UserEntity user = (UserEntity) session.getAttribute("user");
        if (user == null) {
            return new ModelAndView("redirect:/user/login");
        }

        user = homeService.getUserByUserId(((UserEntity) session.getAttribute("user")).getUserId());

        ModelAndView modelAndView = new ModelAndView("/home/mypage/modify");
        modelAndView.addObject("user", user);
        return modelAndView;
    }

    // 북마크 모델
    @RequestMapping(value = "/mypage/bookmark",
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getMyPageBookmark(HttpSession session,
                                          @RequestParam(value = "p", defaultValue = "1", required = false) int requestPage) {

        if (session.getAttribute("user") == null) {
            // 로그인하지 않은 경우 로그인 페이지로 이동
            return new ModelAndView("redirect:/user/login");
        }

        // 세션에서 사용자 정보 가져오기
        UserEntity user = (UserEntity) session.getAttribute("user");

        // 사용자 ID 전달
        int totalPosts = this.homeService.getTotalPostsBookmark(user.getUserId());

        PageModel pageModel = new PageModel(
                HomeService.PAGE_COUNT,
                totalPosts,
                requestPage);

        CampsiteEntity[] campsiteBookmarkEntities = this.homeService.getCampsitesBookmarkPaged(user.getUserId(), pageModel);

        ModelAndView modelAndView = new ModelAndView("home/mypage/bookmark");


        // 북마크 열 삽입
        modelAndView.addObject("campsiteBookmark", campsiteBookmarkEntities);

        // 구분 카테고리 넣기
        modelAndView.addObject("category", homeService.convertCategory(homeService.getCampsitesBookmark(((UserEntity) session.getAttribute("user")).getUserId())));
        // 페이지
        modelAndView.addObject("pageModel", pageModel);

        return modelAndView;
    }

    // qna 모델
    @RequestMapping(value = "/mypage/qna",
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getMyPageQna(HttpSession session,
                                     @RequestParam(value = "p", defaultValue = "1", required = false) int requestPage) {
        // 로그인부터 해라
        if (session.getAttribute("user") == null) {
            return new ModelAndView("redirect:/user/login");
        }

        // 세션에서 사용자 정보 가져오기
        UserEntity user = (UserEntity) session.getAttribute("user");

        // 사용자 ID 전달
        int totalPosts = this.homeService.getTotalPosts(user.getUserId());

        // 페이지모델
        PageModel pageModel = new PageModel(
                HomeService.PAGE_COUNT,
                totalPosts,
                requestPage);

        QnaEntity[] qna;
        if (user.getAuthority() == 0) {
            // 사용자가 관리자인 경우, 모든 문의 내역을 가져온다
            qna = this.homeService.getAllQnaByPage(pageModel, String.valueOf(user));
        } else {
            // 사용자가 일반 사용자인 경우, 해당 사용자가 문의한 내역만 가져온다
            qna = this.homeService.getUserQnaByPage(pageModel, user);
        }

        ModelAndView modelAndView = new ModelAndView("/home/mypage/qna");

        // qna 열 삽입
        modelAndView.addObject("qna", qna);

        // 페이지 모델
        modelAndView.addObject("pageModel", pageModel);

        modelAndView.addObject("user", user);
        return modelAndView;
    }


    @RequestMapping(value = "/mypage/reservation",
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getMyPageReservation(HttpSession session, @RequestParam(value = "page", defaultValue = "1", required = false) int requestPage) {
        if (session.getAttribute("user") == null) {
            return new ModelAndView("redirect:/user/login");
        }


        ModelAndView modelAndView;

        UserEntity user = (UserEntity) session.getAttribute("user");

        if (user == null) {
            return new ModelAndView("redirect:/user/login");
        }

        PageModel pageModel = new PageModel(
                HomeService.PAGE_COUNT,
                this.homeService.getReservationCount(user.getIndex()),
                requestPage
        );

        modelAndView = new ModelAndView("/home/mypage/reservation");

        ReservationCampsiteEntity[] reservations = this.homeService.getReservation(user.getIndex(), pageModel);

        if (reservations != null) {
            boolean[] isCancellable = this.homeService.judgmentCancellable(reservations);
            modelAndView.addObject("reservations", reservations);
            modelAndView.addObject("isCancellable", isCancellable);
        }
        modelAndView.addObject("pageModel", pageModel);
        return modelAndView;
    }


    @RequestMapping(value = "/sendContactCodeByUserId", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String postSendCodeByName(UserRecoverContactCodeEntity contactCode, HttpSession session) throws Exception {

        UserEntity user = homeService.getUserByUserIdContact(((UserEntity) session.getAttribute("user")).getUserId(), contactCode.getContact());
        JSONObject result = new JSONObject();

        if (user == null) {
            return String.valueOf(result.put("result", "false")).toLowerCase();
        }

        contactCode = homeService.postContactCodeSalt(contactCode);

        if (contactCode == null) {
            return String.valueOf(result.put("result", "false")).toLowerCase();
        }
        return String.valueOf(result.put("result", "true").put("salt", contactCode.getSalt()));
    }

    @RequestMapping(value = "/sendContactCode", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String postSendCode(UserRecoverContactCodeEntity contactCode) {

        JSONObject result = new JSONObject();
        if (homeService.postUserByContact(contactCode.getContact()) != null) {
            return String.valueOf(result.put("result", "false")).toLowerCase();
        }

        contactCode = homeService.postContactCodeSalt(contactCode);

        if (contactCode != null) {
            return String.valueOf(result.put("result", "true").put("salt", contactCode.getSalt()));

        } else {
            return String.valueOf(result.put("result", "false")).toLowerCase();
        }

    }

    @RequestMapping(value = "/sendEmailCode", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String postSendCode(UserRecoverEmailCodeEntity emailCode) throws MessagingException {

        emailCode = homeService.postEmailCodeSalt(emailCode);
        JSONObject result = new JSONObject();

        if (emailCode != null) {
            return String.valueOf(result.put("result", "true").put("salt", emailCode.getSalt()));

        } else {
            return String.valueOf(result.put("result", "false")).toLowerCase();
        }

    }

    @RequestMapping(value = "/verifyContact", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String postVerifyContact(UserRecoverContactCodeEntity contactCode) {

        JSONObject result = new JSONObject().put("result", homeService.postVerifyContactCodeSalt(contactCode));

        return String.valueOf(result).toLowerCase();

    }

    @RequestMapping(value = "/verifyEmail", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String postVerifyEmail(UserRecoverEmailCodeEntity emailCode) {
        JSONObject result = new JSONObject().put("result", homeService.postVerifyEmailCodeSalt(emailCode));

        return String.valueOf(result).toLowerCase();

    }

    @RequestMapping(value = "/modify/name", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String postModifyUserName(HttpSession session, @RequestParam(value = "name") String name) {

        UserEntity user = (UserEntity) session.getAttribute("user");

        JSONObject result = new JSONObject().put("result", homeService.postModifyUserName(user.getUserId(), name));

        return String.valueOf(result).toLowerCase();
    }


    @RequestMapping(value = "/modify/email", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String postModifyUserEmail(
            HttpSession session,
            @RequestParam(value = "email") String email) {

        UserEntity user = (UserEntity) session.getAttribute("user");

        JSONObject result = new JSONObject().put("result", (homeService.postModifyUserEmail(user.getUserId(), email))).put("email", email);

        return String.valueOf(result).toLowerCase();

    }

    @RequestMapping(value = "/modify/nickname", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String postModifyUserNickname(
            HttpSession session,
            @RequestParam(value = "nickname") String nickname) {
        UserEntity user = (UserEntity) session.getAttribute("user");

        UserModifyResult userModifyResult = homeService.postModifyUserNickname(user.getUserId(), nickname);

        if (userModifyResult == UserModifyResult.SUCCESS) {
            user.setNickname(nickname);
            session.setAttribute("user", user);
        }

        JSONObject result = new JSONObject().put("result", (userModifyResult)).put("nickname", nickname);

        return String.valueOf(result).toLowerCase();

    }

    @RequestMapping(value = "/modify/contact", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String postModifyUserContact(
            HttpSession session,
            @RequestParam(value = "contact") String contact) {

        UserEntity user = (UserEntity) session.getAttribute("user");

        JSONObject result = new JSONObject().put("result", (homeService.postModifyUserContact(user.getUserId(), contact)));

        return String.valueOf(result).toLowerCase();

    }

    @RequestMapping(value = "/modify/password", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String postModifyUserPassword(HttpSession session, @RequestParam(value = "password") String password) {

        UserEntity user = (UserEntity) session.getAttribute("user");

        JSONObject result = new JSONObject().put("result", homeService.postModifyUserPassword(user.getUserId(), password));

        return String.valueOf(result).toLowerCase();

    }

    @RequestMapping(value = "/integratedSearch", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getIntegratedSearch(@RequestParam(value = "query", required = false, defaultValue = "") String query) {
        ModelAndView modelAndView = new ModelAndView("/home/integratedSearch");
        CampsiteEntity[] generals = this.homeService.getCampsiteSearchQuery(query, 0);
        int generalCount = this.homeService.getCampsiteSearchCountQuery(query, 0);
        CampsiteEntity[] autos = this.homeService.getCampsiteSearchQuery(query, 1);
        int autoCount = this.homeService.getCampsiteSearchCountQuery(query, 1);
        CampsiteEntity[] caravans = this.homeService.getCampsiteSearchQuery(query, 2);
        int caravanCount = this.homeService.getCampsiteSearchCountQuery(query, 2);
        CampsiteEntity[] glampings = this.homeService.getCampsiteSearchQuery(query, 3);
        int glampingCount = this.homeService.getCampsiteSearchCountQuery(query, 3);
        NoticeEntity[] notices = this.homeService.getNoticeSearchQuery(query);
        int noticeCount = this.homeService.getNoticeCountSearchQuery(query);
        EventEntity[] events = this.homeService.getEventSearchQuery(query);
        int eventCount = this.homeService.getEventCountSearchQuery(query);

        if (generals != null) {
            modelAndView.addObject("generals", generals);
            modelAndView.addObject("generalCount", generalCount);
        }

        if (autos != null) {
            modelAndView.addObject("autos", autos);
            modelAndView.addObject("autoCount", autoCount);
        }

        if (caravans != null) {
            modelAndView.addObject("caravans", caravans);
            modelAndView.addObject("caravanCount", caravanCount);
        }

        if (glampings != null) {
            modelAndView.addObject("glampings", glampings);
            modelAndView.addObject("glampingCount", glampingCount);
        }

        if (notices != null) {
            modelAndView.addObject("notices", notices);
            modelAndView.addObject("noticeCount", noticeCount);
        }

        if (events != null) {
            modelAndView.addObject("events", events);
            modelAndView.addObject("eventCount", eventCount);
        }

        modelAndView.addObject("query", query);
        return modelAndView;
    }

    @RequestMapping(value = "/image", method = RequestMethod.GET)
    public ResponseEntity<byte[]> getCampsiteImg(@RequestParam(value = "campsiteIndex") int campsiteIndex) {
        CampsiteImageEntity campsiteImage = this.homeService.getCampsiteImg(campsiteIndex);
        ResponseEntity<byte[]> response;
        if (campsiteImage == null) {
            response = new ResponseEntity<>(HttpStatus.OK);
        } else {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentLength(campsiteImage.getImgData().length);
            headers.setContentType(MediaType.parseMediaType(campsiteImage.getImgContentType()));
            response = new ResponseEntity<>(campsiteImage.getImgData(), headers, HttpStatus.OK);
        }
        return response;
    }

    @RequestMapping(value = "/admin", method = RequestMethod.GET)
    public ModelAndView getAdmin(HttpSession session, @RequestParam(value = "page", defaultValue = "1", required = false) int requestPage, @RequestParam(value = "sort", defaultValue = "1", required = false) int sort, @RequestParam(value = "search", defaultValue = "", required = false) String searchCriterion) {
        UserEntity user = (UserEntity) session.getAttribute("user");

        if(user == null){
            return new ModelAndView("/user/login");
        }

        ModelAndView modelAndView = new ModelAndView("/home/admin");

        int allCount = 0;
        switch (sort){
            case 1:
                allCount = this.homeService.getUserCount(searchCriterion);
                break;
            case 2:
                allCount = this.homeService.getCampsiteCount(searchCriterion);
                break;
            case 3:
                allCount = this.homeService.getQnaCount(searchCriterion);
                break;
            case 4:
                allCount = this.homeService.getEventCount(searchCriterion);
                break;
        }

        PageModel pageModel = new PageModel(
                15,
                allCount,
                requestPage);

        switch (sort){
            case 1:
                UserEntity[] users = this.homeService.getUser(pageModel, searchCriterion);
                modelAndView.addObject("users", users);
                break;
            case 2:
                CampsiteEntity[] campsites = this.homeService.getCampsite(pageModel, searchCriterion);
                modelAndView.addObject("campsites", campsites);
                break;
            case 3:
                QnaEntity[] qnas = this.homeService.getQna(pageModel, searchCriterion);
                modelAndView.addObject("qnas", qnas);
                break;
            case 4:
                EventEntity[] events = this.homeService.getEvent(pageModel, searchCriterion);
                modelAndView.addObject("events", events);
                break;
        }

        modelAndView.addObject("pageModel", pageModel);
        modelAndView.addObject("sort", sort);
        modelAndView.addObject("searchCriterion", searchCriterion);

        return modelAndView;
    }

    @RequestMapping(value = "/admin/delete", method = RequestMethod.POST)
    @ResponseBody
    public String getAdminDelete(@RequestParam(value = "index") int index, @RequestParam(value = "sort", defaultValue = "1", required = false) int sort){
        String result = "";
        switch (sort){
            case 1:
                result = String.valueOf(this.homeService.deleteUser(index));
                break;
            case 2:
                result = String.valueOf(this.homeService.deleteCampsite(index));
                break;
            case 4:
                result = String.valueOf(this.homeService.deleteEvent(index));
                break;
        }
        return result;
    }
}
