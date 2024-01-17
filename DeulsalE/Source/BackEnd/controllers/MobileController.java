package com.iforteam.deulsal_i.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iforteam.deulsal_i.entities.NoticeEntity;
import com.iforteam.deulsal_i.enums.SelectQnaResult;
import com.iforteam.deulsal_i.enums.ReservationResult;
import com.iforteam.deulsal_i.enums.UserModifyResult;
import com.iforteam.deulsal_i.services.HelpService;
import com.iforteam.deulsal_i.entities.*;
import com.iforteam.deulsal_i.enums.UserLoginResult;
import com.iforteam.deulsal_i.services.HomeService;
import com.iforteam.deulsal_i.services.MemberService;
import com.iforteam.deulsal_i.services.UserService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import com.iforteam.deulsal_i.models.PageModel;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.mail.MessagingException;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.util.Map;

@Controller
@RequestMapping(value = "/mobile")
public class MobileController {

    private final MemberService memberService;
    private final HelpService helpService;
    private final UserService userService;
    private final HomeService homeService;

    @Autowired
    public MobileController(MemberService memberService, HelpService helpService, UserService userService, HomeService homeService) {
        this.memberService = memberService;
        this.helpService = helpService;
        this.userService = userService;
        this.homeService = homeService;
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public ModelAndView getMobile() {
        ModelAndView modelAndView = new ModelAndView("/mobile/index");

        EventEntity[] events = this.homeService.getEvent();
        NoticeEntity[] notices = this.homeService.getNotice();

        if (events.length != 0) {
            modelAndView.addObject("events", events);
        }
        if (notices.length != 0) {
            modelAndView.addObject("notices", notices);
        }
        return modelAndView;
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public ModelAndView getMobileLogin() {
        return new ModelAndView("/mobile/login");
    }

    // login
    @RequestMapping(value = "/login/mobile",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postLogin(HttpSession session, UserEntity user) {
        UserLoginResult result = this.userService.login(user);
        if (result == UserLoginResult.SUCCESS) {
            session.setAttribute("user", user);
        }
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/register", method = RequestMethod.GET)
    public ModelAndView getMobileRegister() {
        return new ModelAndView("/mobile/register");
    }

    @RequestMapping(value = "/recover", method = RequestMethod.GET)
    public ModelAndView getMobileRecover() {
        return new ModelAndView("/mobile/recover");
    }

    @RequestMapping(value = "/logout",
            method = RequestMethod.GET)
    public ModelAndView getLogout(HttpSession session) {
        ModelAndView modelAndView = new ModelAndView("redirect:/mobile");
        session.setAttribute("user", null);
        return modelAndView;
    }

    @RequestMapping(value = "detail", method = RequestMethod.GET)
    public ModelAndView getDetail(@RequestParam(value = "index") int index,
                                  HttpSession session) {

        CampsiteEntity campsite = memberService.getCampsite(index);

        ModelAndView modelAndView = new ModelAndView("mobile/detail").addObject("campsite", campsite)
                .addObject("additionalFacility", memberService.getAdditionalFacility(index))
                .addObject("peripheralFacility", memberService.getPeripheralFacility(index))
                .addObject("grampingFacility", memberService.getGrampingFacility(index))
                .addObject("campsiteImages", memberService.getCampsiteImages(index));

        if (session.getAttribute("user") != null) {
            modelAndView.addObject("campsiteIsBook", memberService.getCampsiteIsBook(((UserEntity) session.getAttribute("user")).getUserId(), campsite));
        }

        return modelAndView;
    }

    @RequestMapping(value = "campsite",
            method = RequestMethod.GET)
    public ModelAndView getCampsite(@RequestParam(value = "code", defaultValue = "1") int code,
                                    @RequestParam(value = "query", required = false, defaultValue = "") String query,
                                    @RequestParam(value = "sort", required = false, defaultValue = "1") int sort,
                                    @RequestParam(value = "page", required = false, defaultValue = "1") int requestPage,
                                    HttpSession session) {

        ModelAndView modelAndView = new ModelAndView("mobile/campsite");
        modelAndView.addObject("code", code);
        modelAndView.addObject("query", query);
        modelAndView.addObject("sort", sort);

        PageModel pageModel = new PageModel(
                5, memberService.getCampsitesCnt(code, sort, query), requestPage, 3
        );

        CampsiteEntity[] campsites = memberService.getCampsitesByPage(code, sort, query, pageModel);

//        modelAndView.addObject("campsitesByReview", memberService.getCampsitesByTop5(code, 2));
//        modelAndView.addObject("campsitesByStar", memberService.getCampsitesByTop5(code, 3));
//        modelAndView.addObject("campsitesByBook", memberService.getCampsitesByTop5(code, 4));

        modelAndView.addObject("campsites", campsites);
        modelAndView.addObject("campsiteCat", memberService.convertCampsiteCat(campsites));
        modelAndView.addObject("pageModel", pageModel);

        if (session.getAttribute("user") != null) {
            modelAndView.addObject("campsiteIsBook", memberService.getCampsiteIsBook(((UserEntity) session.getAttribute("user")).getUserId(), campsites));
        }


        return modelAndView;
    }

    @RequestMapping(value = "/myInfo", method = RequestMethod.GET)
    public ModelAndView getMyInfo(HttpSession session) {

        if (session.getAttribute("user") == null) {
            return new ModelAndView("/mobile/login");
        }

        UserEntity user = homeService.getUserByUserId(((UserEntity) session.getAttribute("user")).getUserId());

        ModelAndView modelAndView = new ModelAndView("/mobile/myInfo");

        modelAndView.addObject("user", user);

        return modelAndView;
    }

    @RequestMapping(value = "/reservation", method = RequestMethod.GET)
    public ModelAndView getReservation(HttpSession session, @RequestParam(value = "page", defaultValue = "1", required = false) int requestPage) {

        UserEntity user = (UserEntity) session.getAttribute("user");

        if (user == null) {
            return new ModelAndView("/mobile/login");
        }

        ModelAndView modelAndView = new ModelAndView("/mobile/reservation");

        PageModel pageModel = new PageModel(
                5,
                this.homeService.getReservationCount(user.getIndex()),
                requestPage,
                3
        );

        ReservationCampsiteEntity[] reservations = this.homeService.getReservation(user.getIndex(), pageModel);

        if (reservations.length != 0) {
            boolean[] isCancellable = this.homeService.judgmentCancellable(reservations);
            modelAndView.addObject("reservations", reservations);
            modelAndView.addObject("isCancellable", isCancellable);
        }
        modelAndView.addObject("pageModel", pageModel);

        return modelAndView;
    }



    @RequestMapping(value = "/bookmark", method = RequestMethod.GET)
    public ModelAndView getBookmark(HttpSession session, @RequestParam(value = "page", defaultValue = "1", required = false) int requestPage) {

        UserEntity user = (UserEntity) session.getAttribute("user");

        if (user == null) {
            return new ModelAndView("/mobile/login");
        }

        ModelAndView modelAndView = new ModelAndView("/mobile/bookmark");

        int totalPosts = this.homeService.getTotalPostsBookmark(user.getUserId());

        PageModel pageModel = new PageModel(
                5,
                totalPosts,
                requestPage,
                3);

        CampsiteEntity[] campsiteBookmarkEntities = this.homeService.getCampsitesBookmarkPaged(user.getUserId(), pageModel);

        if (campsiteBookmarkEntities.length != 0) {
            modelAndView.addObject("campsiteBookmark", campsiteBookmarkEntities);
        }

        modelAndView.addObject("category", homeService.convertCategory(homeService.getCampsitesBookmark(user.getUserId())));

        modelAndView.addObject("pageModel", pageModel);

        return modelAndView;
    }

    @RequestMapping(value = "/recommendation", method = RequestMethod.GET)
    public ModelAndView getRecommendation() {

        ModelAndView modelAndView = new ModelAndView("/mobile/recommendation");

        return modelAndView;
    }

    @RequestMapping(value = "/integratedSearch", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getIntegratedSearch(@RequestParam(value = "query", required = false, defaultValue = "") String query) {
        ModelAndView modelAndView = new ModelAndView("/mobile/integratedSearch");
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

    @RequestMapping(value = "recommendation/list", method = RequestMethod.GET)
    public ModelAndView postRecommendation(HttpSession session, SurveyEntity survey, @RequestParam(value = "areaName") String areaName, @RequestParam(value = "page", required = false, defaultValue = "1") int requestPage, @RequestParam(value = "sort", required = false, defaultValue = "1") int sort) {

        ModelAndView modelAndView = new ModelAndView("mobile/list/recommendation");
        modelAndView.addObject("areaName", areaName);
        modelAndView.addObject("survey", survey);
        modelAndView.addObject("sort", sort);

        PageModel pageModel = new PageModel(
                5, memberService.getCampsiteCountBySurvey(survey, areaName), requestPage, 3
        );

        CampsiteEntity[] campsites = this.memberService.getCampsiteBySurvey(survey, areaName, sort, pageModel);

        if (campsites != null) {
            modelAndView.addObject("campsites", campsites);
            modelAndView.addObject("campsiteCat", memberService.convertCampsiteCat(campsites));
        }

        if (session.getAttribute("user") != null) {
            modelAndView.addObject("campsiteIsBook", memberService.getCampsiteIsBook(((UserEntity) session.getAttribute("user")).getUserId(), campsites));
        }

        modelAndView.addObject("pageModel", pageModel);

        return modelAndView;
    }

    @RequestMapping(value = "notice", method = RequestMethod.GET)
    public ModelAndView getNotice(@RequestParam(value = "page", defaultValue = "1", required = false) int requestPage,
                                  @RequestParam(value = "search", defaultValue = "", required = false) String searchCriterion,
                                  @RequestParam(value = "sort", defaultValue = "", required = false) String sort) {

        ModelAndView modelAndView = new ModelAndView("/mobile/notice");
        int totalPosts = this.helpService.getTotalPosts(searchCriterion, sort);

        PageModel pageModel = new PageModel(
                9,
                totalPosts,
                requestPage,
                3);

        NoticeEntity[] noticeEntities = this.helpService.getByPageSort(pageModel, searchCriterion, sort);


        modelAndView.addObject("notices", noticeEntities);
        modelAndView.addObject("PageModel", pageModel);
        modelAndView.addObject("searchCriterion", searchCriterion);
        modelAndView.addObject("totalPosts", totalPosts); // totalPosts 값을 모델에 추가
        modelAndView.addObject("sort", sort);


        return modelAndView;
    }

    @RequestMapping(value = "notice/download", method = RequestMethod.GET)
    // index라는 매개변수를 통해 조회할 첨부 파일의 인덱스를 받음
    public ResponseEntity<byte[]> getDownload(@RequestParam(value = "index") int index) {
        // 데이터베이스에서 해당 인덱스에 해당하는 첨부 파일을 조회
        NoticeFileEntity noticeFile = this.helpService.getNoticeFile(index);
        ResponseEntity<byte[]> response;
        // 첨부파일이 없을 경우
        if (noticeFile == null) {
            // HttpStatus.NOT_FOUND를 반환
            response = new ResponseEntity<>(HttpStatus.NOT_FOUND);
            // 첨부파일이 존재할 경우
        } else {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentLength((long) noticeFile.getFileSize());
            headers.setContentType(MediaType.parseMediaType(noticeFile.getFileContentType()));
            // headers에 파일크기와 파일 형식을 설정하고, 파일데이터를 포함하여 ResponseEntity에 담아 반환
            response = new ResponseEntity<>(noticeFile.getFileData(), headers, HttpStatus.OK);
        }
        return response;
    }

    @RequestMapping(value = "/faq",
            method = RequestMethod.GET)
    public ModelAndView getFaq(@RequestParam(value = "page", defaultValue = "1", required = false) int requestPage,
                               @RequestParam(value = "search", defaultValue = "", required = false) String searchCriterion,
                               @RequestParam(value = "sort", defaultValue = "", required = false) String sort) {
        ModelAndView modelAndView = new ModelAndView("/mobile/faq");

        int faqTotalPosts = this.helpService.getFaqTotalPosts(searchCriterion, sort);

        PageModel pageModel = new PageModel(
                9,
                faqTotalPosts,
                requestPage,
                3);

        FaqEntity[] faqEntities = this.helpService.getFaqByPageSort(pageModel, searchCriterion, sort);

        modelAndView.addObject("faq", faqEntities);
        modelAndView.addObject("PageModel", pageModel);
        modelAndView.addObject("searchCriterion", searchCriterion);
        modelAndView.addObject("faqTotalPosts", faqTotalPosts); // totalPosts 값을 모델에 추가
        modelAndView.addObject("sort", sort);

        return modelAndView;
    }

    @RequestMapping(value = "/event",
            method = RequestMethod.GET)
    public ModelAndView getEvent(@RequestParam(value = "page", defaultValue = "1", required = false) int requestPage,
                                 @RequestParam(value = "search", defaultValue = "", required = false) String searchCriterion) {
        ModelAndView modelAndView = new ModelAndView("/mobile/event");

        int totalPosts = this.helpService.getEventTotalPosts(searchCriterion);
        PageModel pageModel = new PageModel(
                3,
                totalPosts,
                requestPage,
                3);

        EventEntity[] eventEntities = this.helpService.getByPageEvent(pageModel, searchCriterion);

        modelAndView.addObject("events", eventEntities);
        modelAndView.addObject("PageModel", pageModel);
        modelAndView.addObject("searchCriterion", searchCriterion);
//        modelAndView.addObject("totalPosts", totalPosts); // totalPosts 값을 모델에 추가

        return modelAndView;
    }

    // 조회수 증가 및 상세페이지(notice/view)에 정보 조회 가능하게끔 해주는 역할
    @RequestMapping(value = "notice/view",
            method = RequestMethod.GET)
    public ModelAndView getNoticeView(@RequestParam(value = "index") int index) {
        ModelAndView modelAndView = new ModelAndView("mobile/view/notice"); // 뷰 이름을 "article/read"로 설정한 ModelAndView 객체 생성
        NoticeEntity notice = this.helpService.readNotice(index); // 주어진 인덱스로 게시글 조회
        modelAndView.addObject("notice", notice); // 모델에 게시글을 추가

        if (notice != null) {
            modelAndView.addObject("attachments", this.helpService.getNoticeFileOf(notice));// 모델에 게시글 첨부 파일을 추가

            // 이전 글과 다음 글 정보 가져오기
            NoticeEntity preNotice = helpService.getPreviousNotice(notice.getIndex());
            modelAndView.addObject("preNotice", preNotice);

            NoticeEntity nextNotice = helpService.getNextNotice(notice.getIndex());
            modelAndView.addObject("nextNotice", nextNotice);

        }

        return modelAndView;
    }





    @RequestMapping(value = "/faq/view", method = RequestMethod.GET)
    public ModelAndView getFaqView(@RequestParam(value = "index") int index) {

        ModelAndView modelAndView = new ModelAndView("mobile/view/faq");
        FaqEntity faq = this.helpService.readFaq(index);
        modelAndView.addObject("faq", faq);

        // 이전 글과 다음 글 정보 가져오기
        FaqEntity preFaq = helpService.getPreviousFaq(faq.getIndex());
        modelAndView.addObject("preFaq", preFaq);

        FaqEntity nextFaq = helpService.getNextFaq(faq.getIndex());
        modelAndView.addObject("nextFaq", nextFaq);
        return modelAndView;
    }

    @RequestMapping(value = "/qna",
            method = RequestMethod.GET)
    public ModelAndView getQna(HttpSession session) {

        ModelAndView modelAndView = new ModelAndView("/mobile/qna");

        UserEntity user = (UserEntity) session.getAttribute("user");

        if (user == null) {
            modelAndView = new ModelAndView("/mobile/login");
        } else {
            modelAndView.addObject("user", user);
        }
        return modelAndView;
    }


    // 게시글, 파일을 DB에 전송하는 메서드
    @RequestMapping(value = "/qna",
            method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public ModelAndView postQna(HttpServletRequest request,
                                QnaEntity qna,
                                @RequestParam(value = "files", required = false) MultipartFile[] files) throws IOException {

        if (files == null) { // 매개변수 files가 null이면

            files = new MultipartFile[0]; //files 배열을 빈 배열로 초기화
        }

        boolean result = this.helpService.putQna(request, qna, files);
        //helpService putNotice 메서드의 작성결과를 result 변수의 boolean 값으로 저장

        ModelAndView modelAndView = new ModelAndView();
        if (result) {
            // help/write => article/read
            modelAndView.setViewName("redirect:/mobile/qna/list");
        } else {
            modelAndView.setViewName("mobile/qna");
            modelAndView.addObject("result", result);
        }
        return modelAndView;
    }


    @RequestMapping(value = "/event/view",
            method = RequestMethod.GET)
    public ModelAndView getEventView(@RequestParam(value = "index") int index) {
        ModelAndView modelAndView = new ModelAndView("mobile/view/event");

        EventEntity event = this.helpService.readEvent(index); // 주어진 인덱스로 게시글 조회
        modelAndView.addObject("event", event);


        if (event != null) {
            modelAndView.addObject("attachments", this.helpService.getEventFileOf(event));


            // 이전 글과 다음 글 정보 가져오기
            EventEntity preEvent = helpService.getPreviousEvent(event.getIndex());
            modelAndView.addObject("preEvent", preEvent);

            EventEntity nextEvent = helpService.getNextEvent(event.getIndex());
            modelAndView.addObject("nextEvent", nextEvent);

        }
        return modelAndView;
    }
    @RequestMapping(value = "event/download",
            method = RequestMethod.GET)
    // index라는 매개변수를 통해 조회할 첨부 파일의 인덱스를 받음
    public ResponseEntity<byte[]> getEventDownload(@RequestParam(value = "index") int index) {
        // 데이터베이스에서 해당 인덱스에 해당하는 첨부 파일을 조회
        EventFileEntity eventFile = this.helpService.getEventFile(index);
        ResponseEntity<byte[]> response;
        // 첨부파일이 없을 경우
        if (eventFile == null) {
            // HttpStatus.NOT_FOUND를 반환
            response = new ResponseEntity<>(HttpStatus.NOT_FOUND);
            // 첨부파일이 존재할 경우
        } else {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentLength((long) eventFile.getFileSize());
            headers.setContentType(MediaType.parseMediaType(eventFile.getFileContentType()));
            // headers에 파일크기와 파일 형식을 설정하고, 파일데이터를 포함하여 ResponseEntity에 담아 반환
            response = new ResponseEntity<>(eventFile.getFileData(), headers, HttpStatus.OK);
        }
        return response;
    }


    @RequestMapping(value = "qna/view",
            method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getQnaView(@RequestParam(value = "index") int index, HttpSession session) {

        ModelAndView modelAndView = new ModelAndView("mobile/view/qna"); // 뷰 이름을 "article/read"로 설정한 ModelAndView 객체 생성
        UserEntity user = (UserEntity) session.getAttribute("user");

        if(user == null) {
            modelAndView = new ModelAndView("/mobile/login");
        }

        QnaEntity qna = this.helpService.readQna(index); // 주어진 인덱스로 게시글 조회
        modelAndView.addObject("qna", qna); // 모델에 게시글을 추가

        SelectQnaResult result = this.helpService.selectQna(index);
        modelAndView.addObject("result", result.name().toLowerCase());

        if (qna != null) {
            modelAndView.addObject("attachments", this.helpService.getQnaFileOf(qna));// 모델에 게시글 첨부 파일을 추가
            AnswerEntity answer = this.helpService.readAnswer(index);
            modelAndView.addObject("answer", answer);
        }
        return modelAndView;
    }

    @RequestMapping(value = "/qna/view",
            method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public ModelAndView postQnaView(HttpServletRequest request,
                                    AnswerEntity answer, QnaEntity qna) throws IOException {

        boolean result = this.helpService.putQnaView(request, answer, qna);
        //helpService putNotice 메서드의 작성결과를 result 변수의 boolean 값으로 저장

        ModelAndView modelAndView = new ModelAndView();
        if (result) {
            // help/write => article/read
            modelAndView.setViewName("redirect:/mobile/qna/list");
        } else {
            modelAndView.setViewName("mobile/qna/view");
            modelAndView.addObject("result", result);
        }
        return modelAndView;
    }
    //문의내역 삭제
    @RequestMapping(value = "/qna/view", method = RequestMethod.DELETE)
    @ResponseBody
    public String deleteQnaView(@RequestParam(value = "index", required = false, defaultValue = "0") int index) {
        boolean result = this.helpService.deleteQnaByIndex(index);
        return String.valueOf(result);
    }


    //문의내역 답변 삭제
    @RequestMapping(value = "/qna/view/answer", method = RequestMethod.DELETE)
    @ResponseBody
    public String deleteQnaViewAnswer(@RequestParam(value = "index", required = false, defaultValue = "0") int index) {
        boolean result = this.helpService.deleteAnswerByIndex(index);
        return String.valueOf(result);
    }

    @RequestMapping(value = "/qna/list",
            method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getQna(@RequestParam(value = "page", defaultValue = "1", required = false) int requestPage,
                               @RequestParam(value = "search", defaultValue = "", required = false) String searchCriterion,
                               HttpSession session) {
        ModelAndView modelAndView = new ModelAndView("/mobile/list/qna");
        UserEntity user = (UserEntity) session.getAttribute("user");

        if (user == null) {
            return new ModelAndView("/mobile/login");
        } else {
            PageModel pageModel = new PageModel(
                    9,
//                    HelpService.PAGE_COUNT,
                    this.helpService.getQnaCount(searchCriterion, user),
                    requestPage,
                    3);


            QnaEntity[] qnas;
            if (user.getAuthority() == 0) {
                // 사용자가 관리자인 경우, 모든 문의 내역을 가져온다
                qnas = this.helpService.getAllQnaByPage(pageModel, searchCriterion);
            } else {
                // 사용자가 일반 사용자인 경우, 해당 사용자가 문의한 내역만 가져온다
                qnas = this.helpService.getUserQnaByPage(pageModel, searchCriterion, user);
            }

            modelAndView.addObject("qnas", qnas);
            modelAndView.addObject("PageModel", pageModel);
            modelAndView.addObject("searchCriterion", searchCriterion);
        }


        return modelAndView;
    }

    @RequestMapping(value = "/qna/modify",
            method = RequestMethod.GET)
    public ModelAndView getQnaModify(HttpSession session, Model model, @RequestParam(value = "index", defaultValue = "1",
            required = false) int index) {

        if (session.getAttribute("user") == null) {
            return new ModelAndView("redirect:/mobile/login");
        }
        QnaEntity qnaEntity = helpService.selectQnaByIndex(index);
        model.addAttribute("qnaEntity", qnaEntity);
        return new ModelAndView("/mobile/modify/qna");
    }


    @RequestMapping(value = "/qna/modify",
            method = RequestMethod.PATCH,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String modifyQnaByIndex(
            HttpServletRequest request,
            @RequestParam(value = "index") int index,
            @RequestParam(value = "title") String title,
            @RequestParam(value = "content") String content,
            @RequestParam(value = "addFileMode") int addFileMode,
            @RequestParam(value = "files", required = false) MultipartFile... files) throws IOException {

        return String.valueOf(this.helpService.modifyQnaByIndex(request, index, title, content, addFileMode, files));
    }




    @RequestMapping(value = "qna/download",
            method = RequestMethod.GET)
    // index라는 매개변수를 통해 조회할 첨부 파일의 인덱스를 받음
    public ResponseEntity<byte[]> getQnaDownload(HttpServletResponse resp, @RequestParam(value = "index") int index) throws UnsupportedEncodingException {
        // 데이터베이스에서 해당 인덱스에 해당하는 첨부 파일을 조회
        QnaFileEntity qnaFile = this.helpService.getQnaFile(index);
        ResponseEntity<byte[]> response;
        // 첨부파일이 없을 경우
        if (qnaFile == null) {
            // HttpStatus.NOT_FOUND를 반환
            response = new ResponseEntity<>(HttpStatus.NOT_FOUND);
            // 첨부파일이 존재할 경우
        } else {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentLength((long) qnaFile.getFileSize());
            headers.setContentType(MediaType.parseMediaType(qnaFile.getFileContentType()));
            headers.set("Content-Disposition", String.format("attachment; filename=\"%s\"", URLEncoder.encode(qnaFile.getFileName(), StandardCharsets.UTF_8)));
//            resp.setHeader("Content-Disposition", String.format("attachment; filename=\"%s\"", URLEncoder.encode(qnaFile.getFileName(), StandardCharsets.UTF_8)));
            // headers에 파일크기와 파일 형식을 설정하고, 파일데이터를 포함하여 ResponseEntity에 담아 반환
            response = new ResponseEntity<>(qnaFile.getFileData(), headers, HttpStatus.OK);
        }
        return response;
    }




    @RequestMapping(value = "campsite",
            method = RequestMethod.POST)
    @ResponseBody
    public String postCampsite(@RequestParam(value = "code", defaultValue = "1") int code,
                               @RequestParam(value = "query", required = false, defaultValue = "") String query,
                               @RequestParam(value = "sort", required = false, defaultValue = "1") int sort,
                               @RequestParam(value = "page", required = false, defaultValue = "1") int requestPage,
                               @SessionAttribute(value = "user", required = false) UserEntity user) {


        PageModel pageModel = new PageModel(
                5, memberService.getCampsitesCnt(code, sort, query), requestPage
        );

        CampsiteEntity[] campsites = memberService.getCampsitesByPage(code, sort, query, pageModel);

        JSONObject object = new JSONObject() {{
            put("campsites", campsites);
            put("campsiteCat", memberService.convertCampsiteCat(campsites));
            put("pageModel", pageModel);


        }};


        if (user == null) {
            return String.valueOf(object);
        }

        object.put("campsiteIsBook", memberService.getCampsiteIsBook(user.getUserId(), campsites));
        object.put("user", user);

        return String.valueOf(object);
    }


    @RequestMapping(value = "bookmark", method = RequestMethod.POST)
    @ResponseBody
    public String postBookmark(@SessionAttribute(value = "user", required = false) UserEntity user, CampsiteBookmarkEntity campsiteBookmark) {
        if (user == null) {
            return "user_null";
        }
        return String.valueOf(memberService.postBookmark(campsiteBookmark.setUserId(user.getUserId())));
    }

    @RequestMapping(value = "bookmark", method = RequestMethod.DELETE)
    @ResponseBody
    public String deleteBookmark(@SessionAttribute(value = "user", required = false) UserEntity user, @RequestParam(value = "campsiteIndex") int campsiteIndex) {
        if (user == null) {
            return "user_null";
        }
        return String.valueOf(memberService.deleteBookmark(user.getUserId(), campsiteIndex));
    }

    @RequestMapping(value = "/verifyContact", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String postVerifyContact(UserRecoverContactCodeEntity contactCode) {

        JSONObject result = new JSONObject().put("result", homeService.postVerifyContactCodeSalt(contactCode));

        return String.valueOf(result).toLowerCase();

    }

    @RequestMapping(value = "/name", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String postModifyUserName(HttpSession session, @RequestParam(value = "name") String name) {

        UserEntity user = (UserEntity) session.getAttribute("user");

        JSONObject result = new JSONObject().put("result", homeService.postModifyUserName(user.getUserId(), name));

        return String.valueOf(result).toLowerCase();
    }

    @RequestMapping(value = "/nickname", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
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

    @RequestMapping(value = "/contact", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String postModifyUserContact(
            HttpSession session,
            @RequestParam(value = "contact") String contact) {

        UserEntity user = (UserEntity) session.getAttribute("user");

        JSONObject result = new JSONObject().put("result", (homeService.postModifyUserContact(user.getUserId(), contact)));

        return String.valueOf(result).toLowerCase();

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

    @RequestMapping(value = "/verifyEmail", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String postVerifyEmail(UserRecoverEmailCodeEntity emailCode) {
        JSONObject result = new JSONObject().put("result", homeService.postVerifyEmailCodeSalt(emailCode));

        return String.valueOf(result).toLowerCase();

    }

    @RequestMapping(value = "/email", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String postModifyUserEmail(
            HttpSession session,
            @RequestParam(value = "email") String email) {

        UserEntity user = (UserEntity) session.getAttribute("user");

        System.out.println(user.getUserId());
        System.out.println(email);

        JSONObject result = new JSONObject().put("result", (homeService.postModifyUserEmail(user.getUserId(), email))).put("email", email);

        return String.valueOf(result).toLowerCase();

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

    @RequestMapping(value = "/password", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String postModifyUserPassword(HttpSession session, @RequestParam(value = "password") String password) {

        UserEntity user = (UserEntity) session.getAttribute("user");

        JSONObject result = new JSONObject().put("result", homeService.postModifyUserPassword(user.getUserId(), password));

        return String.valueOf(result).toLowerCase();

    }

    @RequestMapping(value = "/reserve", method = RequestMethod.GET)
    public ModelAndView getReserve(HttpSession session, @RequestParam(value = "index") int index) throws JsonProcessingException {
        if (session.getAttribute("user") == null) {
            return new ModelAndView("/mobile/login");
        }

        ModelAndView modelAndView = new ModelAndView("/mobile/reserve");
        CampsiteEntity campsite = this.memberService.getCampsite(index);
        modelAndView.addObject("campsite", campsite);
        String costList = campsite.getCostList();
        if (costList != "" && costList != null) {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Map<String, String>> costMap = mapper.readValue(costList, Map.class);
            modelAndView.addObject("costMap", costMap);
        }
        return modelAndView;
    }

    @RequestMapping(value = "/reserve",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postReserve(HttpSession session,ReservationEntity reservation, @RequestParam(value = "strStartDay") String strStartDay, @RequestParam(value = "strEndDay") String strEndDay) throws ParseException {
        UserEntity user = (UserEntity) session.getAttribute("user");
        ReservationResult result = this.memberService.postReservation(user, reservation, strStartDay, strEndDay);

        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};

        return responseObject.toString();
    }
}
