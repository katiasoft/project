package com.iforteam.deulsal_i.mappers;

import com.iforteam.deulsal_i.entities.*;
import com.iforteam.deulsal_i.models.PageModel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.tomcat.jni.User;

@Mapper
public interface HomeMapper {
    // bookmark
    CampsiteEntity[] selectCampsitesBookmark(@Param(value = "userId") String userId);

    CampsiteEntity[] selectCampsitesBookmarkPaged(@Param(value = "userId") String userId,
                                                  @Param(value = "pageModel") PageModel pageModel);

    int selectGetCountBySearchCriterion(@Param(value = "userId") String userId);

    // qna

    // 관리자용 문의 내역 조회
    QnaEntity[] selectAllQnaByPage(@Param(value = "pageModel") PageModel pageModel,
                                   @Param(value = "userId") String userId);

    // 사용자가 문의한 내역 조회
    QnaEntity[] selectUserQnaByPage(@Param(value = "pageModel") PageModel pageModel,
                                    @Param(value = "userId") String userId);

    // reservation
    ReservationCampsiteEntity[] selectReservationCampsiteByUserIndex(@Param(value = "userIndex") int userIndex, @Param(value = "pageModel") PageModel pageModel);
    int selectReservationCountByUserIndex(@Param(value = "userIndex") int userIndex);

    // modify
    int getCampsitesBookmarkCount(String userId);

    UserEntity selectUserByUserId(@Param(value = "userId") String userId);
    UserEntity selectUserByUserIdContact(@Param(value = "userId") String userId, @Param(value = "contact") String contact);
    UserEntity selectUserByContact(@Param(value = "contact") String contact);
    UserEntity selectUserByNickname(@Param(value = "preNickname") String preNickname);
    UserRecoverEmailCodeEntity selectEmailCodeSalt(UserRecoverEmailCodeEntity contactCode);
    UserRecoverContactCodeEntity selectContactCodeSalt(UserRecoverContactCodeEntity contactCode);
    CampsiteEntity[] selectCampsiteBySearchQuery(@Param(value = "query") String query, @Param(value = "campsiteType") int campsiteType);
    int selectCampsiteCountBySearchQuery(@Param(value = "query") String query, @Param(value = "campsiteType") int campsiteType);
    NoticeEntity[] selectNoticeBySearchQuery(@Param(value = "query") String query);
    int selectNoticeCountBySearchQuery(@Param(value = "query") String query);
    EventEntity[] selectEventBySearchQuery(@Param(value = "query") String query);
    int selectEventCountBySearchQuery(@Param(value = "query") String query);

    CampsiteImageEntity selectCampsiteImage(@Param(value = "index") int index);

    EventEntity[] selectEvent();

    NoticeEntity[] selectNotice();

    UserEntity[] selectUser(@Param(value = "pageModel") PageModel pageModel, @Param(value = "query") String searchCriterion);
    int selectUserCount(@Param(value = "query") String searchCriterion);
    int deleteUser(@Param(value = "index") int index);

    CampsiteEntity[] selectCampsite(@Param(value = "pageModel") PageModel pageModel, @Param(value = "query") String searchCriterion);
    int selectCampsiteCount(@Param(value = "query") String searchCriterion);
    int deleteCampsite(@Param(value = "index") int index);


    QnaEntity[] selectQna(@Param(value = "pageModel") PageModel pageModel, @Param(value = "query") String searchCriterion);
    int selectQnaCount(@Param(value = "query") String searchCriterion);

    EventEntity[] selectEventAll(@Param(value = "pageModel") PageModel pageModel, @Param(value = "query") String searchCriterion);
    int selectEventCount(@Param(value = "query") String searchCriterion);
    int deleteEvent(@Param(value = "index") int index);

    int updateUserEmail(UserEntity user);
    int updateUserByUserId(UserEntity user);

    int insertEmailCodeSalt(UserRecoverEmailCodeEntity contactCode);
    int insertContactCodeSalt(UserRecoverContactCodeEntity contactCode);

    int deleteEmailCodeSalt(UserRecoverEmailCodeEntity contactCode);
    int deleteContactCodeSalt(UserRecoverContactCodeEntity contactCode);

}
