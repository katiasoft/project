package com.iforteam.deulsal_i.controllers;

import com.iforteam.deulsal_i.entities.*;
import com.iforteam.deulsal_i.enums.SelectQnaResult;
import com.iforteam.deulsal_i.models.PageModel;
import com.iforteam.deulsal_i.services.HelpService;
import org.apache.catalina.User;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
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
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.security.Principal;
import java.text.ParseException;
import java.util.List;

@Controller
@RequestMapping(value = "/help")
public class HelpController {
    private final HelpService helpService;

    @Autowired
    public HelpController(HelpService helpService) {
        this.helpService = helpService;
    }

    @RequestMapping(value = "/format")
    public ModelAndView getFormat() {
        return new ModelAndView("/help/format");
    }


    //    ------------------------- qna ---------------------

    @RequestMapping(value = "/qna",
            method = RequestMethod.GET)
    public ModelAndView getQna(HttpSession session) {

        ModelAndView modelAndView = new ModelAndView("/help/qna");

        UserEntity user = (UserEntity) session.getAttribute("user");

        if (user == null) {
            modelAndView = new ModelAndView("/user/login");
        } else {
            modelAndView.addObject("user", user);
        }
        return modelAndView;
    }


    // 게시글, 파일을 DB에 전송하는 메서드
    @RequestMapping(value = "/qna",
            method = RequestMethod.POST,
            produces = MediaType.TEXT_HTML_VALUE)
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
            modelAndView.setViewName("redirect:/help/qna/list");
        } else {
            modelAndView.setViewName("help/qna");
            modelAndView.addObject("result", result);
        }
        return modelAndView;
    }

    @RequestMapping(value = "qna/view",
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getQnaView(@RequestParam(value = "index") int index, HttpSession session) {

        ModelAndView modelAndView = new ModelAndView("help/view/qna"); // 뷰 이름을 "article/read"로 설정한 ModelAndView 객체 생성
        UserEntity user = (UserEntity) session.getAttribute("user");

        if(user == null) {
            modelAndView = new ModelAndView("/user/login");
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
            method = RequestMethod.POST,
            produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public ModelAndView postQnaView(HttpServletRequest request,
                                    AnswerEntity answer, QnaEntity qna) throws IOException {

        boolean result = this.helpService.putQnaView(request, answer, qna);
        //helpService putNotice 메서드의 작성결과를 result 변수의 boolean 값으로 저장

        ModelAndView modelAndView = new ModelAndView();
        if (result) {
            // help/write => article/read
            modelAndView.setViewName("redirect:/help/qna/list");
        } else {
            modelAndView.setViewName("help/qna/view");
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
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getQnaList(@RequestParam(value = "page", defaultValue = "1", required = false) int requestPage,
                                   @RequestParam(value = "search", defaultValue = "", required = false) String searchCriterion,
                                   HttpSession session) {

        ModelAndView modelAndView = new ModelAndView("/help/list/qna");
        UserEntity user = (UserEntity) session.getAttribute("user");

        if (user == null) {
            modelAndView = new ModelAndView("/user/login");
        } else {
            PageModel pageModel = new PageModel(
                    HelpService.PAGE_COUNT,
                    this.helpService.getQnaCount(searchCriterion, user),
                    requestPage);


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
            return new ModelAndView("redirect:/user/login");
        }
        QnaEntity qnaEntity = helpService.selectQnaByIndex(index);
        model.addAttribute("qnaEntity", qnaEntity);
        return new ModelAndView("/help/modify/qna");
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
    public ResponseEntity<byte[]> getQnaDownload(@RequestParam(value = "index") int index) {
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
            // headers에 파일크기와 파일 형식을 설정하고, 파일데이터를 포함하여 ResponseEntity에 담아 반환
            response = new ResponseEntity<>(qnaFile.getFileData(), headers, HttpStatus.OK);
        }
        return response;
    }


    //    ------------------------- qna ---------------------


    //    ------------------------- faq ---------------------

    @RequestMapping(value = "/faq",
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getFaq(@RequestParam(value = "page", defaultValue = "1", required = false) int requestPage,
                               @RequestParam(value = "search", defaultValue = "", required = false) String searchCriterion,
                               @RequestParam(value = "sort", defaultValue = "", required = false) String sort) {
        ModelAndView modelAndView = new ModelAndView("/help/faq");

        int faqTotalPosts = this.helpService.getFaqTotalPosts(searchCriterion, sort);

        PageModel pageModel = new PageModel(
                HelpService.PAGE_COUNT,
                faqTotalPosts,
                requestPage);

        FaqEntity[] faqEntities = this.helpService.getFaqByPageSort(pageModel, searchCriterion, sort);

        modelAndView.addObject("faq", faqEntities);
        modelAndView.addObject("PageModel", pageModel);
        modelAndView.addObject("searchCriterion", searchCriterion);
        modelAndView.addObject("faqTotalPosts", faqTotalPosts); // totalPosts 값을 모델에 추가
        modelAndView.addObject("sort", sort);

        return modelAndView;
    }

    @RequestMapping(value = "/faq/modify", method = RequestMethod.GET)
    public ModelAndView getFaqModify(HttpSession session, Model model, @RequestParam(value = "index", defaultValue = "1", required = false) int index, FaqEntity faqEntity) {

        if (session.getAttribute("user") == null) {
            // 로그인하지 않은 경우 로그인 페이지로 이동
            return new ModelAndView("redirect:/user/login");
        }

        faqEntity = helpService.selectFaqByIndex(index);
        model.addAttribute("faqEntity", faqEntity);
        return new ModelAndView("/help/modify/faq");
    }

    @RequestMapping(value = "/faq/modify", method = RequestMethod.PATCH)
    @ResponseBody
    public String modifyFaqByIndex(@RequestParam(value = "index") int index,
                                   @RequestParam(value = "sort") String sort,
                                   @RequestParam(value = "subject") String subject,
                                   @RequestParam(value = "content") String content) {
        boolean result = this.helpService.modifyFaqByIndex(index, sort, subject, content);
        return String.valueOf(result);
    }


    @RequestMapping(value = "/faq/view", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getFaqView(@RequestParam(value = "index") int index) {

        ModelAndView modelAndView = new ModelAndView("help/view/faq");
        FaqEntity faq = this.helpService.readFaq(index);
        modelAndView.addObject("faq", faq);

        // 이전 글과 다음 글 정보 가져오기
        FaqEntity preFaq = helpService.getPreviousFaq(faq.getIndex());
        modelAndView.addObject("preFaq", preFaq);

        FaqEntity nextFaq = helpService.getNextFaq(faq.getIndex());
        modelAndView.addObject("nextFaq", nextFaq);
        return modelAndView;
    }

    @RequestMapping(value = "/faq/view",
            method = RequestMethod.DELETE)
    @ResponseBody
    public String deleteFaqView(@RequestParam(value = "index", required = false, defaultValue = "0") int index) {
        boolean result = this.helpService.deleteFaqByIndex(index);
        return String.valueOf(result);
    }


    @RequestMapping(value = "/faq/write", method = RequestMethod.GET)
    public ModelAndView getFaqWrite(HttpSession session) {

        if (session.getAttribute("user") == null) {
            // 로그인하지 않은 경우 로그인 페이지로 이동
            return new ModelAndView("redirect:/user/login");
        }
        return new ModelAndView("/help/write/faq");
    }

    @RequestMapping(value = "/faq/write",
            method = RequestMethod.POST,
            produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public ModelAndView postFaqWrite(HttpServletRequest request,
                                     FaqEntity faq) {

        boolean result = this.helpService.putFaq(request, faq);


        ModelAndView modelAndView = new ModelAndView();
        if (result) {
            // help/write => article/read
            modelAndView.setViewName("redirect:/help/faq");
        } else {
            modelAndView.setViewName("help/write/faq");
            modelAndView.addObject("result", result);
        }
        return modelAndView;
    }

    @RequestMapping(value = "uploadFaqImage",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postUploadFaqImage(HttpServletRequest request,
                                     @RequestParam(value = "upload") MultipartFile file) throws IOException {
        FaqImageEntity faqImage = this.helpService.putFaqImage(request, file);
        JSONObject responseObject = new JSONObject() {{

            put("url", "/help/downloadFaqImage?index=" + faqImage.getIndex());

        }};

        return responseObject.toString();
    }

    @RequestMapping(value = "downloadFaqImage", method = RequestMethod.GET)
    // index라는 매개변수를 통해 다운로드할 이미지의 인덱스를 받음
    public ResponseEntity<byte[]> getDownloadFaqImage(@RequestParam(value = "index") int index) {
        FaqImageEntity file = this.helpService.getFaqImage(index);
        ResponseEntity<byte[]> response;
        // 가져온 이미지 정보가 null인 경우
        if (file == null) {
            // HttpStatus.NOT_FOUND를 반환
            response = new ResponseEntity<>(HttpStatus.NOT_FOUND);
            // 가져온 이미지 정보가 존재할 경우
        } else {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentLength((long) file.getImgSize());
            headers.setContentType(MediaType.parseMediaType(file.getImgContentType()));
            // 이미지 데이터와 headers 정보를 함께 ResponseEntity에 담아 반환
            response = new ResponseEntity<>(file.getImgData(), headers, HttpStatus.OK);
        }
        // 서비스 에 있는 file 잘 확인할것 변경 할꺼면 같이 변경
        return response;
    }


//    ------------------------- faq ---------------------


//    ------------------------- notice ---------------------

    @RequestMapping(value = "/notice",
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getNotice(
            @RequestParam(value = "page", defaultValue = "1", required = false) int requestPage,
            @RequestParam(value = "search", defaultValue = "", required = false) String searchCriterion,
            @RequestParam(value = "sort", defaultValue = "", required = false) String sort) {


        ModelAndView modelAndView = new ModelAndView("/help/notice");

        int totalPosts = this.helpService.getTotalPosts(searchCriterion, sort);

        PageModel pageModel = new PageModel(
                HelpService.PAGE_COUNT,
                totalPosts,
                requestPage);
//        NoticeEntity[] noticeEntities = this.helpService.getByPage(pageModel, searchCriterion);

        NoticeEntity[] noticeEntities = this.helpService.getByPageSort(pageModel, searchCriterion, sort);

        modelAndView.addObject("notices", noticeEntities);
        modelAndView.addObject("PageModel", pageModel);
        modelAndView.addObject("searchCriterion", searchCriterion);
        modelAndView.addObject("totalPosts", totalPosts); // totalPosts 값을 모델에 추가
        modelAndView.addObject("sort", sort);

        return modelAndView;
    }

    @RequestMapping(value = "/notice/modify", method = RequestMethod.GET)
    public ModelAndView getNoticeModify(HttpSession session, Model model, @RequestParam(value = "index", defaultValue = "1", required = false) int index, NoticeEntity noticeEntity) {

        if (session.getAttribute("user") == null) {
            // 로그인하지 않은 경우 로그인 페이지로 이동
            return new ModelAndView("redirect:/user/login");
        }

        noticeEntity = helpService.selectNoticeByIndex(index);
        model.addAttribute("noticeEntity", noticeEntity);
        return new ModelAndView("/help/modify/notice");
    }


    @RequestMapping(value = "/notice/modify", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String modifyByIndex(
            HttpServletRequest request,
            @RequestParam(value = "index") int index,
            @RequestParam(value = "subject") String subject,
            @RequestParam("content") String content,
            @RequestParam(value = "addFileMode") int addFileMode,
            @RequestParam(value = "files", required = false) MultipartFile... files) throws IOException {


        return String.valueOf(this.helpService.modifyByIndex(request, index, subject, content, addFileMode, files));

    }


    @RequestMapping(value = "/notice/view",
            method = RequestMethod.DELETE)
    @ResponseBody
    public String deleteNoticeView(@RequestParam(value = "index", required = false, defaultValue = "0") int index) {
        boolean result = this.helpService.deleteByIndex(index);
        return String.valueOf(result);
    }

    @RequestMapping(value = "/notice/write",
            method = RequestMethod.GET)
    public ModelAndView getNoticeWrite(HttpSession session) {
        if (session.getAttribute("user") == null) {
            // 로그인하지 않은 경우 로그인 페이지로 이동
            return new ModelAndView("redirect:/user/login");
        }
        return new ModelAndView("/help/write/notice");
    }


    // 게시글, 파일을 DB에 전송하는 메서드
    @RequestMapping(value = "/notice/write",
            method = RequestMethod.POST,
            produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public ModelAndView postNoticeWrite(HttpServletRequest request,
                                        NoticeEntity notice,
                                        @RequestParam(value = "files", required = false) MultipartFile[] files) throws IOException {

        if (files == null) { // 매개변수 files가 null이면

            files = new MultipartFile[0]; //files 배열을 빈 배열로 초기화
        }

        boolean result = this.helpService.putNotice(request, notice, files);
        //helpService putNotice 메서드의 작성결과를 result 변수의 boolean 값으로 저장

        ModelAndView modelAndView = new ModelAndView();
        if (result) {
            // help/write => article/read
            modelAndView.setViewName("redirect:/help/notice");
        } else {
            modelAndView.setViewName("help/write/notice");
            modelAndView.addObject("result", result);
        }
        return modelAndView;
    }


    // 조회수 증가 및 상세페이지(notice/view)에 정보 조회 가능하게끔 해주는 역할
    @RequestMapping(value = "notice/view",
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getNoticeView(@RequestParam(value = "index") int index) {
        ModelAndView modelAndView = new ModelAndView("help/view/notice"); // 뷰 이름을 "article/read"로 설정한 ModelAndView 객체 생성
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


    // ckeditor 내용 안의 이미지를 업로드 할 때 필요한 것
    @RequestMapping(value = "uploadNoticeImage",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postUploadNoticeImage(HttpServletRequest request,
                                        @RequestParam(value = "upload") MultipartFile file) throws IOException {

        NoticeImageEntity noticeImage = this.helpService.putNoticeImage(request, file);
        JSONObject responseObject = new JSONObject() {{
            // url이라는 키에 이미지 다운로드 URL을 저장
            put("url", "/help/downloadNoticeImage?index=" + noticeImage.getIndex());

        }};
        // JSONObject 타입을 문자열 타입으로 변환하여 반환
        return responseObject.toString();
    }

    // 업로드 된 이미지를 다운로드해서 ckeditor 내용 상에서 보여주는 메서드
    @RequestMapping(value = "downloadNoticeImage", method = RequestMethod.GET)
    // index라는 매개변수를 통해 다운로드할 이미지의 인덱스를 받음
    public ResponseEntity<byte[]> getDownloadNoticeImage(@RequestParam(value = "index") int index) {
        // 해당 인덱스에 해당하는 이미지 정보를 가져온다
        NoticeImageEntity file = this.helpService.getNoticeImage(index);
        ResponseEntity<byte[]> response;
        // 가져온 이미지 정보가 null인 경우
        if (file == null) {
            // HttpStatus.NOT_FOUND를 반환
            response = new ResponseEntity<>(HttpStatus.NOT_FOUND);
            // 가져온 이미지 정보가 존재할 경우
        } else {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentLength((long) file.getImgSize());
            headers.setContentType(MediaType.parseMediaType(file.getImgContentType()));
            // 이미지 데이터와 headers 정보를 함께 ResponseEntity에 담아 반환
            response = new ResponseEntity<>(file.getImgData(), headers, HttpStatus.OK);
        }
        return response;
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


    //    이벤트
    @RequestMapping(value = "/event",
            method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getEvent(@RequestParam(value = "page", defaultValue = "1", required = false) int requestPage,
                                 @RequestParam(value = "search", defaultValue = "", required = false) String searchCriterion) {
        ModelAndView modelAndView = new ModelAndView("/help/event");

        int totalPosts = this.helpService.getEventTotalPosts(searchCriterion);
        PageModel pageModel = new PageModel(
                HelpService.PAGE_COUNT,
                totalPosts,
                requestPage);

        EventEntity[] eventEntities = this.helpService.getByPageEvent(pageModel, searchCriterion);

        modelAndView.addObject("events", eventEntities);
        modelAndView.addObject("PageModel", pageModel);
        modelAndView.addObject("searchCriterion", searchCriterion);
        modelAndView.addObject("totalPosts", totalPosts); // totalPosts 값을 모델에 추가

        return modelAndView;
    }


    @RequestMapping(value = "/event/view", method = RequestMethod.GET,
            produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getEventView(@RequestParam(value = "index") int index) {
        ModelAndView modelAndView = new ModelAndView("/help/view/event");

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


}
