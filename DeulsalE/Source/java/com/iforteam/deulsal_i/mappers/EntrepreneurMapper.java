package com.iforteam.deulsal_i.mappers;

import com.iforteam.deulsal_i.entities.*;
import com.iforteam.deulsal_i.models.PageModel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.ArrayList;

@Mapper
public interface EntrepreneurMapper {
    CampsiteEntity[] selectCampsiteByName(@Param(value = "pageModel") PageModel pageModel, @Param(value = "searchCriterion") String searchCriterion);

    int selectCampsiteCount(@Param(value = "name") String name);

    CampsiteEntity selectCampsiteByIndex(@Param(value = "index") int index);

    CampsiteEntity selectCampsiteByIndexUserNull(@Param(value = "index") int index);

    CampsiteEntity[] selectCampsiteByUserIndex(@Param(value = "userIndex") int userIndex);

    CampsiteEntity selectCampsiteByLatLng(@Param(value = "latitude") double latitude, @Param(value = "longitude") double longitude);

    AdditionalFacilityEntity selectAdditionalFacilityByIndex(@Param(value = "index") int index);

    PeripheralFacilityEntity selectPeripheralFacilityByIndex(@Param(value = "index") int index);

    GrampingFacilityEntity selectGrampingFacilityByIndex(@Param(value = "index") int index);

    CampsiteImageEntity[] selectCampsiteImageByIndex(@Param(value = "index") int index);

    int selectCampsiteImageCountByIndex(@Param(value = "index") int index);

    int[] selectCampsiteImgIndexByCampsiteIndex(@Param(value = "index") int index);

    EventImageEntity selectEventImageByIndex(@Param("index") int index);

    EventEntity[] selectEventByUserIndex(@Param("userIndex") int userIndex);

    EventEntity selectEventByIndex(@Param("index") int index);

    ReservationEntity[] selectReservationByCampsiteIndex(@Param("campsiteIndexList") ArrayList<Integer> campsiteIndexList, @Param(value = "pageModel") PageModel pageModel);

    ReservationEntity[] selectDepositByCampsiteIndex(@Param("campsiteIndexList") ArrayList<Integer> campsiteIndexList, @Param(value = "pageModel") PageModel pageModel);

    ReservationEntity[] selectReservationAllByCampsiteIndex(@Param("campsiteIndexList") ArrayList<Integer> campsiteIndexList, @Param(value = "pageModel") PageModel pageModel);

    int selectReservationCountByCampsiteIndex(@Param("campsiteIndexList") ArrayList<Integer> campsiteIndexList);

    int selectDepositCountByCampsiteIndex(@Param("campsiteIndexList") ArrayList<Integer> campsiteIndexList);

    int selectAllCountByCampsiteIndex(@Param("campsiteIndexList") ArrayList<Integer> campsiteIndexList);

    ReservationEntity selectReservationByIndex(@Param("index") int index);

    int selectEventFileCountByIndex(@Param("index") int index);

    int updateCampsite(CampsiteEntity campsite);

    int updateAdditionalFacility(AdditionalFacilityEntity additionalFacility);

    int updatePeripheralFacility(PeripheralFacilityEntity peripheralFacility);

    int updateGrampingFacility(GrampingFacilityEntity grampingFacility);

    int updateEvent(EventEntity event);

    int updateReservation(ReservationEntity reservation);

    int insertCampsite(CampsiteEntity campsite);

    int insertAdditionalFacility(AdditionalFacilityEntity additionalFacility);

    int insertPeripheralFacility(PeripheralFacilityEntity peripheralFacility);

    int insertGrampingFacility(GrampingFacilityEntity grampingFacility);

    int insertCampsiteImg(CampsiteImageEntity campsiteImage);

    int insertCampsiteFile(CampsiteFileEntity campsiteFile);

    int insertEventImg(EventImageEntity eventImage);

    int insertEvent(EventEntity event);

    int insertEventFile(EventFileEntity eventFile);

    int deleteCampsiteImg(@Param(value = "index") int index);

    int deleteEventFile(@Param(value = "eventIndex") int eventIndex);

    int deleteEvent(@Param(value = "eventIndex") int eventIndex);
}
