package com.iforteam.deulsal_i.services;

import com.iforteam.deulsal_i.entities.*;
import com.iforteam.deulsal_i.enums.SelectQnaResult;
import com.iforteam.deulsal_i.mappers.HelpMapper;
import com.iforteam.deulsal_i.models.PageModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.ParseException;
import java.util.Date;
import java.util.List;

@Service
public class HelpService {
    private final HelpMapper helpMapper;

    public static final int PAGE_COUNT = 10; // 해당 게시물 갯수

    @Autowired
    public HelpService(HelpMapper helpMapper) {
        this.helpMapper = helpMapper;
    }

    @Transactional
    public boolean putNotice(HttpServletRequest request, NoticeEntity notice, MultipartFile[] files) throws IOException {

        String selectCategory = request.getParameter("cat");

        notice.setView(0)
                .setCreatedAt(new Date()) // 현재날짜와 시간으로 설정
                .setClientIp(request.getRemoteAddr()) // 원격 ip주소로 설정
                .setClientUa(request.getHeader("User-Agent")) //
                .setDeleted(false) // deleted 속성을 false로 설정
                .setSort(selectCategory);

        if (this.helpMapper.insertNotice(notice) < 1) {
            //삽입된 행의 수가 1보다 작다면

            return false;
        }
        int inserted = 0;
        // files 배열을 돌면서 각 파일에 대한 정보를 AttachmentEntity 객체로 만들고, 데이터베이스에 삽입
        for (MultipartFile file : files) {
            NoticeFileEntity noticeFile = new NoticeFileEntity()
                    .setNoticeIndex(notice.getIndex())
                    .setFileData(file.getBytes())
                    .setFileContentType(file.getContentType())
                    .setFileSize(file.getSize())
                    .setFileName(file.getOriginalFilename());
            //inserted 변수는 삽입된 첨부파일의 수를 추적
            inserted += this.helpMapper.insertNoticeFile(noticeFile);
        }

        return inserted == files.length;
        // inserted 값이 files 배열의 길이와 같은지 비교
        // 모든 파일이 삽입되었다면 true를 반환하고, 그렇지 않으면 false를 반환
    }

    public NoticeEntity readNotice(int index) {
        NoticeEntity notice = this.helpMapper.selectNoticeByIndex(index); // 주어진 인덱스로 게시글 조회
        if (notice != null && !notice.isDeleted()) { // 게시글이 존재하고 삭제되지 않은 경우
            notice.setView(notice.getView() + 1); // 조회수 증가
            this.helpMapper.updateNotice(notice); // 게시글 업데이트
        }
        return notice;
    }

    // 게시글에 대한 첨부 파일들을 조회하는 메서드
    public NoticeFileEntity[] getNoticeFileOf(NoticeEntity notice) {

        // 게시글 인덱스를 매개변수로 받아 해당 게시글에 대한 첨부파일을 조회하고 첨부파일들은 AttachmentEntity 배열형태로 반환됨
        return this.helpMapper.selectNoticeFilesByNoticeIndexNoData(notice.getIndex());
    }

    public NoticeImageEntity putNoticeImage(HttpServletRequest request, MultipartFile file) throws IOException {
        // ImageEntity 객체를 생성하고 업로드된 이미지의 정보를 설정
        NoticeImageEntity noticeImage = new NoticeImageEntity()
                .setCreatedAt(new Date())
                .setClientIp(request.getRemoteAddr())
                .setClientUa(request.getHeader("User-Agent"))
                .setImgName(file.getOriginalFilename())
                .setImgSize((int) file.getSize())
                .setImgContentType(file.getContentType())
                .setImgData(file.getBytes());

        // 이미지를 데이터베이스에 저장
        this.helpMapper.insertNoticeImage(noticeImage);

        return noticeImage;
    }

    // 주어진 인덱스에 해당하는 이미지를 데이터베이스에서 조회하여 반환
    public NoticeImageEntity getNoticeImage(int index) {

        return this.helpMapper.selectNoticeImage(index);
    }

    // 주어진 인덱스에 해당하는 첨부파일을 데이터베이스에서 조회하여 반환
    public NoticeFileEntity getNoticeFile(int index) {
        return this.helpMapper.selectNoticeFile(index);
    }

    // 데이터베이스에서 index보다 작은 글 중 가장 큰 index를 가진 글을 조회
    public NoticeEntity getPreviousNotice(int index) {

        NoticeEntity previousNotice = this.helpMapper.selectFindTopByIndexLessThanOrderByIndexDesc(index);
        if (previousNotice != null) {
            return previousNotice;
        }
        return null;

    }

    // 데이터베이스에서 index보다 큰 글 중 가장 작은 index를 가진 글을 조회
    public NoticeEntity getNextNotice(int index) {

        NoticeEntity nextNotice = this.helpMapper.selectFindTopByIndexGreaterThanOrderByIndexAsc(index);
        if (nextNotice != null) {
            return nextNotice;
        }
        return null;
    }


//    public NoticeEntity[] getByPage(PageModel pageModel, String searchCriterion) {
//        NoticeEntity[] noticeEntities = this.helpMapper.selectByPage(pageModel, searchCriterion);
//        // 인터페이스 지정한 매개변수를 여기에도 추가 String searchCriterion, String searchQuery
//        return noticeEntities;
//    }

    public NoticeEntity[] getByPageSort(PageModel pageModel, String searchCriterion, String sort) {
        NoticeEntity[] noticeEntities = this.helpMapper.selectByPageSort(pageModel, searchCriterion, sort);
        // 인터페이스 지정한 매개변수를 여기에도 추가 String searchCriterion, String searchQuery
        return noticeEntities;
    }

//    public int getCount(String searchCriterion) {
//        return this.helpMapper.selectCount(searchCriterion);
//    }


    public boolean deleteByIndex(int index) {
        return this.helpMapper.deleteByIndex(index) > 0;
    }

    // 데이터베이스에서 총 개수를 조회
    public int getTotalPosts(String searchCriterion, String sort) {
        int totalPosts = this.helpMapper.selectGetCountBySearchCriterion(searchCriterion, sort);

        return totalPosts;
    }


    public boolean modifyByIndex(HttpServletRequest request, int index, String subject, String content, int addFileMode, MultipartFile... files) throws IOException {

        NoticeEntity exitNotice = this.helpMapper.modifyByIndex(index);

        exitNotice.setSubject(subject)
                .setContent(content)
                .setClientIp(request.getRemoteAddr())
                .setClientUa(request.getHeader("User-Agent"));

        int baseNoticeFileCount = this.helpMapper.getNoticeCountByIndex(index);

        if (files == null) {
            return this.helpMapper.updateNotice(exitNotice) > 0;
        }

//        for (MultipartFile file : files) {
//
//        }

        System.out.println(addFileMode);


        // 기존 게시글에는 파일 없으나 수정할 때 신규파일 추가
        if (addFileMode == 2) {
            return this.helpMapper.updateNotice(exitNotice) > 0 && modifyNotice(request, exitNotice, files);
        }


        // 텍스트 업데이트 + 기존 첨부파일 삭제하고 신규 파일 추가
        if (addFileMode == 3) {
            System.out.println("=====");
            System.out.println(baseNoticeFileCount);
            System.out.println("=====");
            if (baseNoticeFileCount > 0) {
                System.out.println("=====");
                System.out.println("기존에 파일이 있는걸로 확인 하였음");
                System.out.println(exitNotice.getIndex());
                System.out.println("=====");
                this.helpMapper.deleteFileByIndex(exitNotice.getIndex());
            }
            return this.helpMapper.updateNotice(exitNotice) > 0 && modifyNotice(request, exitNotice, files);
        }

        // 기존의 파일에서 추가한다.
        if (addFileMode == 4) {
            System.out.println("파일 추가 또는 수정 에러");
            return this.helpMapper.updateNotice(exitNotice) > 0 && modifyNotice(request, exitNotice, files);

        }

        return this.helpMapper.updateNotice(exitNotice) > 0;
    }

    public boolean modifyNotice(HttpServletRequest request, NoticeEntity notice, MultipartFile... files) throws IOException {
        System.out.println("NoticeEntity index: " + notice.getIndex());
        for (MultipartFile file : files) {
            System.out.println("File: " + file.getOriginalFilename());
        }

        int inserted = 0;
        for (MultipartFile file : files) {
            NoticeFileEntity noticeFile = new NoticeFileEntity();
            noticeFile.setNoticeIndex(notice.getIndex());
            noticeFile.setFileName(file.getOriginalFilename());
            noticeFile.setFileSize((double) file.getSize());
            noticeFile.setFileContentType(file.getContentType());
            noticeFile.setFileData(file.getBytes());

            inserted += this.helpMapper.insertNoticeFile(noticeFile) == 0 ? 0 : 1;
        }
        if (inserted != files.length) {
            System.out.println("file 에러");
            return false;
        }
        return true;
    }


    public NoticeEntity selectNoticeByIndex(int index) {
        return this.helpMapper.selectNoticeByIndex(index);
    }


//    ------------------------- notice ---------------------

//    ------------------------- Faq ---------------------


//    public FaqEntity[] getFaqByPage(PageModel pageModel, String searchCriterion) {
//        FaqEntity[] faqEntities = this.helpMapper.selectFaqByPage(pageModel, searchCriterion);
//        // 인터페이스 지정한 매개변수를 여기에도 추가 String searchCriterion, String searchQuery
//        return faqEntities;
//    }
//
//    public int getFaqCount(String searchCriterion) {
//        return this.helpMapper.selectFaqCount(searchCriterion);
//    }

    public FaqImageEntity putFaqImage(HttpServletRequest request, MultipartFile file) throws IOException {
        FaqImageEntity faqImage = new FaqImageEntity()
                .setCreatedAt(new Date())
                .setClientIp(request.getRemoteAddr())
                .setClientUa(request.getHeader("User-Agent"))
                .setImgName(file.getOriginalFilename())
                .setImgSize((int) file.getSize())
                .setImgContentType(file.getContentType())
                .setImgData(file.getBytes());
        this.helpMapper.insertFaqImage(faqImage);
        return faqImage;
    }

    public FaqEntity readFaq(int index) {
        FaqEntity faq = this.helpMapper.selectFaqByIndex(index);
        if (faq != null && !faq.isDeleted()) {
            faq.setView(faq.getView() + 1);
            this.helpMapper.updateFaq(faq);
        }
        return faq;
    }

    @Transactional
    public boolean putFaq(HttpServletRequest request, FaqEntity faq) {

        String selectCategory = request.getParameter("cat");

        faq.setView(0)
                .setCreatedAt(new Date()) // 현재날짜와 시간으로 설정
                .setClientIp(request.getRemoteAddr()) // 원격 ip주소로 설정
                .setClientUa(request.getHeader("User-Agent")) //
                .setDeleted(false) // deleted 속성을 false로 설정
                .setSort(selectCategory);
        if (this.helpMapper.insertFaq(faq) < 1) {
            //삽입된 행의 수가 1보다 작다면
        }
        return false;
    }

    public FaqImageEntity getFaqImage(int index) {

        return this.helpMapper.selectFaqImage(index);
    }

    public FaqEntity selectFaqByIndex(int index) {
        return this.helpMapper.selectFaqByIndex(index);
    }

    public boolean modifyFaqByIndex(int index, String sort, String subject, String content) {
        return this.helpMapper.modifyFaqByIndex(index, sort, subject, content) > 0;
    }

    public boolean deleteFaqByIndex(int index) {
        return this.helpMapper.deleteFaqByIndex(index) > 0;
    }

    public int getFaqTotalPosts(String searchCriterion, String sort) {
        int faqTotalPosts = this.helpMapper.selectGetCountFaqBySearchCriterion(searchCriterion, sort);
        return faqTotalPosts;
    }


    public FaqEntity[] getFaqByPageSort(PageModel pageModel, String searchCriterion, String sort) {
        FaqEntity[] faqEntities = this.helpMapper.selectFaqByPageSort(pageModel, searchCriterion, sort);
        // 인터페이스 지정한 매개변수를 여기에도 추가 String searchCriterion, String searchQuery
        return faqEntities;
    }


    public FaqEntity getPreviousFaq(int index) {

        FaqEntity previousFaq = this.helpMapper.selectFindTopByIndexLessThanOrderByIndexDescFaq(index);
        if (previousFaq != null) {
            return previousFaq;
        }
        return null;

    }


    public FaqEntity getNextFaq(int index) {

        FaqEntity nextFaq = this.helpMapper.selectFindTopByIndexGreaterThanOrderByIndexAscFaq(index);
        if (nextFaq != null) {
            return nextFaq;
        }
        return null;
    }

//    ------------------------- Faq ---------------------


//    ------------------------- Qna ---------------------

    @Transactional
    public boolean putQna(HttpServletRequest request, QnaEntity qna, MultipartFile[] files) throws IOException {

        qna.setCreatedAt(new Date()) // 현재날짜와 시간으로 설정
                .setClientIp(request.getRemoteAddr()) // 원격 ip주소로 설정
                .setClientUa(request.getHeader("User-Agent")) //
                .setDeleted(false) // deleted 속성을 false로 설정
                .setSort(false);

        if (this.helpMapper.insertQna(qna) < 1) {
            //삽입된 행의 수가 1보다 작다면

            return false;
        }
        int inserted = 0;
        // files 배열을 돌면서 각 파일에 대한 정보를 AttachmentEntity 객체로 만들고, 데이터베이스에 삽입
        for (MultipartFile file : files) {
            QnaFileEntity qnaFile = new QnaFileEntity()
                    .setQnaIndex(qna.getIndex())
                    .setFileData(file.getBytes())
                    .setFileContentType(file.getContentType())
                    .setFileSize(file.getSize())
                    .setFileName(file.getOriginalFilename());
            //inserted 변수는 삽입된 첨부파일의 수를 추적
            inserted += this.helpMapper.insertQnaFile(qnaFile);
        }

        return inserted == files.length;
        // inserted 값이 files 배열의 길이와 같은지 비교
        // 모든 파일이 삽입되었다면 true를 반환하고, 그렇지 않으면 false를 반환
    }

    public QnaEntity readQna(int index) {
        QnaEntity qna = this.helpMapper.selectQnaByIndex(index); // 주어진 인덱스로 게시글 조회
        return qna;
    }

    ;

    public AnswerEntity readAnswer(int index) {
        AnswerEntity answer = this.helpMapper.selectAnswerByQnaIndex(index); // 주어진 인덱스로 게시글 조회
        return answer;
    }

    public SelectQnaResult selectQna(int index) {

        if (helpMapper.selectAnswerByQnaIndex(index) != null) {
            return SelectQnaResult.SUCCESS;
        }

        return SelectQnaResult.FAILURE;
    }

    // 게시글에 대한 첨부 파일들을 조회하는 메서드
    public QnaFileEntity[] getQnaFileOf(QnaEntity qna) {

        // 게시글 인덱스를 매개변수로 받아 해당 게시글에 대한 첨부파일을 조회하고 첨부파일들은 AttachmentEntity 배열형태로 반환됨
        return this.helpMapper.selectQnaFilesByQnaIndexNoData(qna.getIndex());
    }

    public int getQnaCount(String searchCriterion, UserEntity user) {
        if (user.getAuthority() == 0) {
            // 사용자가 관리자인 경우, 모든 문의 내역의 개수를 반환
            return this.helpMapper.selectAllQnaCount(searchCriterion);
        } else {
            // 사용자가 일반 사용자인 경우, 해당 사용자가 문의한 내역의 개수를 반환
            return this.helpMapper.selectUserQnaCount(searchCriterion, user.getUserId());
        }
    }

    public QnaEntity[] getAllQnaByPage(PageModel pageModel, String searchCriterion) {
        return this.helpMapper.selectAllQnaByPage(pageModel, searchCriterion);
    }

    public QnaEntity[] getUserQnaByPage(PageModel pageModel, String searchCriterion, UserEntity user) {
        return this.helpMapper.selectUserQnaByPage(pageModel, searchCriterion, user.getUserId());
    }


    public QnaEntity selectQnaByIndex(int index) {
        return this.helpMapper.selectQnaByIndex(index);
    }

    public QnaFileEntity[] selectQnaByIndexFiles(int index) {
        return this.helpMapper.selectQnaFilesByQnaIndexNoData(index);
    }


    public boolean modifyQnaByIndex(HttpServletRequest request, int index, String title,
                                    String content, int addFileMode, MultipartFile... files) throws IOException {

        QnaEntity exitQna = this.helpMapper.modifyQnaByIndex(index);

        exitQna.setTitle(title)
                .setContent(content)
                .setClientIp(request.getRemoteAddr())
                .setClientUa(request.getHeader("User-Agent"));

        int baseFileCount = this.helpMapper.getQnaCountByIndex(index);

        if (files == null) {
            return this.helpMapper.updateQnaEntity(exitQna) > 0;
        }

        // 기존 게시글에는 파일 없으나 수정할 때 신규파일 추가
        if (addFileMode == 2) {
            return this.helpMapper.updateQnaEntity(exitQna) > 0 && modifyQna(request, exitQna, files);
        }

        // 텍스트 업데이트 + 기존 첨부파일 삭제하고 신규 파일 추가
        if (addFileMode == 3) {
            System.out.println("=====");
            System.out.println(baseFileCount);
            System.out.println("=====");
            if (baseFileCount > 0) {
                System.out.println("=====");
                System.out.println("기존에 파일이 있는걸로 확인 하였음");
                System.out.println(exitQna.getIndex());
                System.out.println("=====");
                this.helpMapper.deleteQnaFileByIndex(exitQna.getIndex());
            }
            return this.helpMapper.updateQnaEntity(exitQna) > 0 && modifyQna(request, exitQna, files);
        }

        // 기존의 파일에서 추가한다
        if (addFileMode == 4) {
            System.out.println("파일 추가 또는 수정 에러");
            return this.helpMapper.updateQnaEntity(exitQna) > 0 && modifyQna(request, exitQna, files);
        }

        return this.helpMapper.updateQnaEntity(exitQna) > 0;
    }


    public boolean modifyQna(HttpServletRequest request, QnaEntity qna, MultipartFile... files) throws IOException {
        System.out.println("QnaEntity index: " + qna.getIndex());

        for (MultipartFile file : files) {
            System.out.println("File: " + file.getOriginalFilename());
        }

        int inserted = 0;
        for (MultipartFile file : files) {
            QnaFileEntity qnaFile = new QnaFileEntity();
            qnaFile.setQnaIndex(qna.getIndex());
            qnaFile.setFileName(file.getOriginalFilename());
            qnaFile.setFileSize((double) file.getSize());
            qnaFile.setFileContentType(file.getContentType());
            qnaFile.setFileData(file.getBytes());

            inserted += this.helpMapper.insertQnaFile(qnaFile) == 0 ? 0 : 1;
        }
        if (inserted != files.length) {
            System.out.println("file 에러");
            return false;
        }
        return true;
    }


    // 주어진 인덱스에 해당하는 첨부파일을 데이터베이스에서 조회하여 반환
    public QnaFileEntity getQnaFile(int index) {
        return this.helpMapper.selectQnaFile(index);
    }

    public boolean deleteQnaByIndex(int index) {
        return this.helpMapper.deleteQnaByIndex(index) > 0;
    }

    public boolean deleteAnswerByIndex(int index) {

        boolean answerDeleted = helpMapper.deleteAnswerByIndex(index) > 0;

        QnaEntity qna = helpMapper.selectQnaByIndex(index);

        if (qna != null && answerDeleted) {
            // 문의글이 삭제되지 않았지만 답변은 삭제된 경우
            // 답변이 삭제되었으므로 문의글의 sort_flag를 업데이트

            qna.setSort(false);

            boolean sortFlagUpdated = helpMapper.updateQna(qna) > 0;
            return sortFlagUpdated;
        }

        return false;
    }


    public boolean putQnaView(HttpServletRequest request, AnswerEntity answer, QnaEntity qna) throws IOException {

        answer.setQnaIndex(qna.getIndex())
                .setCreatedAt(new Date()) // 현재날짜와 시간으로 설정
                .setClientIp(request.getRemoteAddr()) // 원격 ip주소로 설정
                .setClientUa(request.getHeader("User-Agent")) //
                .setDeleted(false); // deleted 속성을 false로 설정

        qna.setSort(true); // 게시글의 sort_flag를 true로 설정
        this.helpMapper.updateQna(qna); // 게시글 업데이트

        if (this.helpMapper.insertQnaView(answer) < 1) {
            //삽입된 행의 수가 1보다 작다면
            return false;
        }

        return true;
    }


    //    ------------------------- Event ---------------------

    public int getEventTotalPosts(String searchCriterion) {
        int totalPosts = this.helpMapper.selectGetCountByEventSearchCriterion(searchCriterion);

        return totalPosts;
    }

    public EventEntity[] getByPageEvent(PageModel pageModel, String searchCriterion) {
        EventEntity[] eventEntities = this.helpMapper.selectByEventPage(pageModel, searchCriterion);
        // 인터페이스 지정한 매개변수를 여기에도 추가 String searchCriterion, String searchQuery
        return eventEntities;
    }


    public EventEntity readEvent(int index) {
        EventEntity event = this.helpMapper.selectEventByIndex(index); // 주어진 인덱스로 게시글 조회
        if (event != null && !event.isDeleted()) { // 게시글이 존재하고 삭제되지 않은 경우
            event.setView(event.getView() + 1); // 조회수 증가
            this.helpMapper.updateEvent(event); // 게시글 업데이트
        }
        return event;
    }

    public EventEntity getPreviousEvent(int index) {

        EventEntity previousEvent = this.helpMapper.selectFindTopByIndexLessThanOrderByIndexDescEvent(index);
        if (previousEvent != null) {
            return previousEvent;
        }
        return null;

    }


    public EventEntity getNextEvent(int index) {

        EventEntity nextEvent = this.helpMapper.selectFindTopByIndexGreaterThanOrderByIndexAscEvent(index);
        if (nextEvent != null) {
            return nextEvent;
        }
        return null;
    }

    // 게시글에 대한 첨부 파일들을 조회하는 메서드
    public EventFileEntity[] getEventFileOf(EventEntity event) {

        // 게시글 인덱스를 매개변수로 받아 해당 게시글에 대한 첨부파일을 조회하고 첨부파일들은 AttachmentEntity 배열형태로 반환됨
        return this.helpMapper.selectEventFilesByNoticeIndexNoData(event.getIndex());
    }

    // 주어진 인덱스에 해당하는 첨부파일을 데이터베이스에서 조회하여 반환
    public EventFileEntity getEventFile(int index) {
        return this.helpMapper.selectEventFile(index);
    }






    //    ------------------------- Event ---------------------


}