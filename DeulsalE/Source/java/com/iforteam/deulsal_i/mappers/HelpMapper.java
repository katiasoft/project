package com.iforteam.deulsal_i.mappers;

import com.iforteam.deulsal_i.entities.*;
import com.iforteam.deulsal_i.models.PageModel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface HelpMapper {

    // 삽입된 행의 수를 반환(게시글)
    int insertNotice(NoticeEntity notice);

    // 삽입된 행의 수를 반환(첨부파일)
    int insertNoticeFile(NoticeFileEntity noticeFile);

    // 이미지를 데이터베이스에 저장
    int insertNoticeImage(NoticeImageEntity noticeImage);

    // 게시글 인덱스를 매개변수로 받아 해당 인덱스의 게시글을 조회
    NoticeEntity selectNoticeByIndex(@Param(value = "index") int index);

    // 게시글 인덱스를 매개변수로 받아 해당 게시글에 대한 첨부 파일들을 조회
    NoticeFileEntity[] selectNoticeFilesByNoticeIndexNoData(@Param(value = "noticeIndex") int noticeIndex);

    // 주어진 인덱스에 해당하는 첨부파일을 데이터베이스에서 조회
    NoticeFileEntity selectNoticeFile(@Param(value = "index") int index);

    // 주어진 인덱스에 해당하는 이미지를 데이터베이스에서 조회
    NoticeImageEntity selectNoticeImage(@Param(value = "index") int index);


    int selectCount(@Param(value = "searchCriterion") String searchCriterion);

    NoticeEntity[] selectByPage(@Param(value = "pageModel") PageModel pageModel,
                                @Param(value = "searchCriterion") String searchCriterion);

    NoticeEntity[] selectByPageSort(@Param(value = "pageModel") PageModel pageModel,
                                    @Param(value = "searchCriterion") String searchCriterion,
                                    @Param(value = "sort") String sort);

    // 게시글 엔티티를 매개변수로 받아 게시글을 업데이트
    int updateNotice(NoticeEntity notice);

    int deleteByIndex(@Param(value = "index") int index);

    int deleteFileByIndex(@Param(value = "noticeIndex") int noticeIndex);


    NoticeEntity modifyByIndex(@Param(value = "index") int index);

    NoticeEntity selectFindTopByIndexLessThanOrderByIndexDesc(@Param(value = "index") int index);

    NoticeEntity selectFindTopByIndexGreaterThanOrderByIndexAsc(@Param(value = "index") int index);

    int selectGetCountBySearchCriterion(@Param(value = "searchCriterion") String searchCriterion, @Param(value = "sort") String sort);


//    --------------- notice ---------------


    //    --------------- faq ---------------
    int insertFaq(FaqEntity faq);

    int insertFaqImage(FaqImageEntity faqImage);

    FaqEntity selectFaqByIndex(@Param(value = "index") int index);

    FaqImageEntity selectFaqImage(@Param(value = "index") int index);

    int selectFaqCount(@Param(value = "searchCriterion") String searchCriterion);

    FaqEntity[] selectFaqByPage(@Param(value = "pageModel") PageModel pageModel,
                                @Param(value = "searchCriterion") String searchCriterion);


    FaqEntity[] selectFaqByPageSort(@Param(value = "pageModel") PageModel pageModel,
                                    @Param(value = "searchCriterion") String searchCriterion,
                                    @Param(value = "sort") String sort);

    int updateFaq(FaqEntity faq); // 게시글 엔티티를 매개변수로 받아 게시글을 업데이트


    int modifyFaqByIndex(@Param(value = "index") int index,
                         @Param(value = "sort") String sort,
                         @Param(value = "subject") String subject,
                         @Param(value = "content") String content);

    int deleteFaqByIndex(@Param(value = "index") int index);

    int selectGetCountFaqBySearchCriterion(@Param(value = "searchCriterion") String searchCriterion,
                                           @Param(value = "sort") String sort);


    FaqEntity selectFindTopByIndexLessThanOrderByIndexDescFaq(@Param(value = "index") int index);
    FaqEntity selectFindTopByIndexGreaterThanOrderByIndexAscFaq(@Param(value = "index") int index);



// ------------------ faq ---------------


//    --------------- qna ---------------

    int insertQna(QnaEntity qna);

    int insertQnaView(AnswerEntity answer);

    int insertQnaFile(QnaFileEntity qnaFile);

    // 게시글 인덱스를 매개변수로 받아 해당 인덱스의 게시글을 조회
    QnaEntity selectQnaByIndex(@Param(value = "index") int index);

    // 답변 인덱스를 매개변수로 받아 해당 인덱스의 게시글을 조회
    AnswerEntity selectAnswerByQnaIndex(@Param(value = "qnaIndex") int qnaIndex);

    // 게시글 인덱스를 매개변수로 받아 해당 게시글에 대한 첨부 파일들을 조회
    QnaFileEntity[] selectQnaFilesByQnaIndexNoData(@Param(value = "qnaIndex") int qnaIndex);

    // 주어진 인덱스에 해당하는 첨부파일을 데이터베이스에서 조회
    QnaFileEntity selectQnaFile(@Param(value = "index") int index);

    // 모든 문의 내역의 개수 조회
    int selectAllQnaCount(@Param(value = "searchCriterion") String searchCriterion);

    // 사용자가 문의한 내역의 개수 조회
    int selectUserQnaCount(@Param(value = "searchCriterion") String searchCriterion,
                           @Param(value = "userId") String userId);

    // 관리자용 문의 내역 조회
    QnaEntity[] selectAllQnaByPage(@Param(value = "pageModel") PageModel pageModel,
                                   @Param(value = "searchCriterion") String searchCriterion);

    // 사용자가 문의한 내역 조회
    QnaEntity[] selectUserQnaByPage(@Param(value = "pageModel") PageModel pageModel,
                                @Param(value = "searchCriterion") String searchCriterion,
                                @Param(value = "userId") String userId);


    QnaEntity modifyQnaByIndex(@Param(value = "index") int index);

    int getQnaCountByIndex(@Param(value = "index") int index);

    int getNoticeCountByIndex(@Param(value = "index") int index);


    int updateQnaEntity(QnaEntity qna);

    int updateQna(QnaEntity qna); // 게시글 엔티티를 매개변수로 받아 게시글을 업데이트

    int updateQnaSortFlag(@Param("index") int index);

    int deleteQnaByIndex(@Param(value = "index") int index);

    int deleteAnswerByIndex(@Param(value = "qnaIndex") int qnaIndex);

    int deleteQnaFileByIndex(@Param(value = "qnaIndex") int qnaIndex);





    //    ------------------------- Event ---------------------

    int insertEvent(EventEntity event);

    int updateEvent(EventEntity event);


    int selectGetCountByEventSearchCriterion(@Param(value = "searchCriterion") String searchCriterion);


    int selectEventCount(@Param(value = "searchCriterion") String searchCriterion);


    EventEntity[] selectByEventPage(@Param(value = "pageModel") PageModel pageModel,
                                    @Param(value = "searchCriterion") String searchCriterion);



    EventEntity EventSelectAll(@Param(value = "index") int index);

    EventEntity selectFindTopByIndexLessThanOrderByIndexDescEvent(@Param(value = "index") int index);
    EventEntity selectFindTopByIndexGreaterThanOrderByIndexAscEvent(@Param(value = "index") int index);

    // 게시글 인덱스를 매개변수로 받아 해당 게시글에 대한 첨부 파일들을 조회
    EventFileEntity[] selectEventFilesByNoticeIndexNoData(@Param(value = "eventIndex") int eventIndex);

    EventEntity selectEventByIndex(@Param(value = "index") int index);

    EventFileEntity selectEventFile(@Param(value = "index") int index);







    //    ------------------------- Event ---------------------


}
