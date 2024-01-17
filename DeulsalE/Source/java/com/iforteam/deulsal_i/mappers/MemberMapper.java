package com.iforteam.deulsal_i.mappers;

import com.iforteam.deulsal_i.entities.*;
import com.iforteam.deulsal_i.models.PageModel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Date;

@Mapper
public interface MemberMapper {
    CampsiteEntity selectCampsiteByIndex(@Param(value = "index") int index);
    AdditionalFacilityEntity selectAdditionalFacilityByIndex(@Param(value = "campsite_index") int index);
    PeripheralFacilityEntity selectPeripheralFacilityByIndex(@Param(value = "campsite_index") int index);
    GrampingFacilityEntity selectGrampingFacilityByIndex(@Param(value = "campsite_index") int index);

    int selectBookmarkByUserIdCampsiteIndex(@Param(value = "userId") String userId, @Param(value = "campsiteIndex") int campsiteIndex);

    int insertBookmark(CampsiteBookmarkEntity campsiteBookmark);
    int deleteBookmarkByUserIdCampsiteIndex(@Param(value = "userId") String userId, @Param(value = "campsiteIndex") int campsiteIndex);

    CampsiteImageEntity[] selectCampsiteImagesByCampsiteIndex(@Param(value = "campsiteIndex") int campsiteIndex);

    CampsiteImageEntity selectCampsiteMainImageByIndex(@Param(value = "campsiteIndex") int campsiteIndex);

//    CampsiteImageEntity[] selectIsCampsiteMainImageByIndex(@Param(value = "campsiteIndex") int campsiteIndex);

    CampsiteImageEntity selectCampsiteImageByIndex(@Param(value = "index") int index);

    CampsiteEntity[] selectCampsitesByCodeSort(@Param(value = "code") int code, @Param(value = "sort") int sort, @Param(value = "query") String query);
    CampsiteEntity[] selectCampsitesByCodeSortPage(@Param(value = "code") int code,
                                                   @Param(value = "sort") int sort,
                                                   @Param(value = "query") String query,
                                                   @Param(value = "pageModel") PageModel pageModel);

    CampsiteEntity[] selectCampsitesByTop5(@Param(value = "code") int code, @Param(value = "sort") int sort);

    ReservationEntity[] selectReservationByUserIndex(@Param(value = "userIndex") int userIndex);

    ReservationEntity[] selectReservationByCampsiteIndex(@Param(value = "campsiteIndex") int campsiteIndex);

    ReservationEntity[] selectReservationByCampsiteIndexSite(@Param(value = "campsiteIndex") int campsiteIndex, @Param(value = "site") String site);

    int selectReservationByStartDayToEndDaySiteCampsiteIndex(@Param(value = "startDay") Date startDay, @Param(value = "endDay") Date endDay, @Param(value = "site") String site, @Param(value = "campsiteIndex") int campsiteIndex);

    CampsiteEntity[] selectCampsiteBySurvey(@Param(value = "survey")SurveyEntity survey, @Param(value = "areaName") String areaName, @Param(value = "sort") int sort, @Param(value = "pageModel") PageModel pageModel);

    int selectCampsiteCountBySurvey(@Param(value = "survey")SurveyEntity survey, @Param(value = "areaName") String areaName);

    int insertReservation(ReservationEntity reservation);

    int updateCampsiteBookmarkCnt(CampsiteEntity campsite);

    ReservationEntity[] selectReservations(@Param(value = "campsiteIndex")int campsiteIndex, @Param(value = "userId") String userId);
    ReservationEntity selectReservation(@Param(value = "index")int index);

    ReviewEntity[] selectReviewsByCampsiteIndex(@Param(value = "campsiteIndex")int campsiteIndex);
    ReviewEntity selectReviewByIndex(@Param(value = "index")int index);
    int insertReview(ReviewEntity review);
    int insertReviewImage(ReviewImageEntity image);
    int updateReview(ReviewEntity review);
    int deleteReview(@Param(value = "index")int index);


}
