package com.iforteam.deulsal_i.services;

import com.iforteam.deulsal_i.entities.*;
import com.iforteam.deulsal_i.enums.ReservationResult;
import com.iforteam.deulsal_i.mappers.MemberMapper;
import com.iforteam.deulsal_i.models.PageModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

@Service
public class MemberService {
    private final MemberMapper memberMapper;

    @Autowired
    public MemberService(MemberMapper memberMapper) {
        this.memberMapper = memberMapper;
    }

    public CampsiteEntity getCampsite(int index) {
        return memberMapper.selectCampsiteByIndex(index);
    }

    public AdditionalFacilityEntity getAdditionalFacility(int index) {
        return memberMapper.selectAdditionalFacilityByIndex(index);
    }

    public PeripheralFacilityEntity getPeripheralFacility(int index) {
        return memberMapper.selectPeripheralFacilityByIndex(index);
    }

    public GrampingFacilityEntity getGrampingFacility(int index) {
        return memberMapper.selectGrampingFacilityByIndex(index);
    }

    public boolean postUserBookmarkCampsite(String userId, int campsiteIndex) {
        return memberMapper.selectBookmarkByUserIdCampsiteIndex(userId, campsiteIndex) > 0;
    }

    @Transactional
    public boolean postBookmark(CampsiteBookmarkEntity campsiteBookmark) {

        if (memberMapper.insertBookmark(campsiteBookmark) > 0) {
            CampsiteEntity campsite = memberMapper.selectCampsiteByIndex(campsiteBookmark.getCampsiteIndex());
            campsite.setBookmarkCnt(campsite.getBookmarkCnt() + 1);

            return memberMapper.updateCampsiteBookmarkCnt(campsite) > 0;
        }

        return false;
    }

    @Transactional
    public boolean deleteBookmark(String userId, int campsiteIndex) {
        if (memberMapper.deleteBookmarkByUserIdCampsiteIndex(userId, campsiteIndex) > 0) {
            CampsiteEntity campsite = memberMapper.selectCampsiteByIndex(campsiteIndex);
            campsite.setBookmarkCnt(campsite.getBookmarkCnt() - 1);

            return memberMapper.updateCampsiteBookmarkCnt(campsite) > 0;
        }
        return false;
    }

    public CampsiteImageEntity[] getCampsiteImages(int campsiteIndex) {
        return memberMapper.selectCampsiteImagesByCampsiteIndex(campsiteIndex);
    }

    public ResponseEntity<byte[]> getImage(int index) {
        ResponseEntity<byte[]> response;
        CampsiteImageEntity campsiteImage = memberMapper.selectCampsiteImageByIndex(index);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentLength((long) campsiteImage.getImgSize());
        headers.setContentType(MediaType.parseMediaType(campsiteImage.getImgContentType()));
        response = new ResponseEntity<>(campsiteImage.getImgData(), headers, HttpStatus.OK);

        return response;
    }

    public int getCampsitesCnt(int code, int sort, String query) {
        return memberMapper.selectCampsitesByCodeSort(code, sort, query).length;
    }

    public CampsiteEntity[] getCampsitesByPage(int code, int sort, String query, PageModel pageModel) {
        CampsiteEntity[] campsite = memberMapper.selectCampsitesByCodeSortPage(code, sort, query, pageModel);
        for (CampsiteEntity campsiteEntity : campsite) {
            convertCampsiteName(campsiteEntity);
            campsiteEntity.setNumberAd(convertCampsiteAd(campsiteEntity).get(campsiteEntity.getIndex()));
        }
        return campsite;
    }

    public CampsiteEntity[] getCampsitesByTop5(int code, int sort) {
        CampsiteEntity[] campsite = memberMapper.selectCampsitesByTop5(code, sort);
        for (CampsiteEntity campsiteEntity : campsite) {
            convertCampsiteName(campsiteEntity);
            campsiteEntity.setNumberAd(convertCampsiteAd(campsiteEntity).get(campsiteEntity.getIndex()));
        }
        return campsite;
    }


    public ResponseEntity<byte[]> getCampsiteMainImage(int campsiteIndex) {
        ResponseEntity<byte[]> response;
        CampsiteImageEntity campsiteImage = memberMapper.selectCampsiteMainImageByIndex(campsiteIndex);

        if (campsiteImage != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentLength((long) campsiteImage.getImgSize());
            headers.setContentType(MediaType.parseMediaType(campsiteImage.getImgContentType()));
            response = new ResponseEntity<>(campsiteImage.getImgData(), headers, HttpStatus.OK);

            return response;
        }
        return null;
    }

    public HashMap<Integer, String> convertCampsiteCat(CampsiteEntity... campsites) {
        HashMap<Integer, String> result = new HashMap<>();

        for (CampsiteEntity campsite : campsites) {
            String cat = "";

            if (campsite.getGeneralCnt() > 0) cat = cat == "" ? "일반" : cat + "/" + "일반";

            if (campsite.getAutoCnt() > 0) cat = cat == "" ? "자동차" : cat + "/" + "자동차";

            if (campsite.getCaravanCnt() > 0) cat = cat == "" ? "카라반" : cat + "/" + "카라반";

            if (campsite.getGlampingCnt() > 0) cat = cat == "" ? "글램핑" : cat + "/" + "글램핑";

            result.put(campsite.getIndex(), cat);
        }
        return result;
    }

    public void convertCampsiteName(CampsiteEntity... campsites) {
        for (CampsiteEntity campsite : campsites) {
            campsite.setName(campsite.getName().split("/")[0]);
        }
    }

    public HashMap<Integer, String> convertCampsiteAd(CampsiteEntity... campsites) {
        HashMap<Integer, String> result = new HashMap<>();

        for (CampsiteEntity campsite : campsites) {
            String[] adSplit = campsite.getNumberAd().split(" ");
            String ad = adSplit[0] + " " + adSplit[1] + " " + adSplit[2];
            result.put(campsite.getIndex(), ad);
        }
        return result;
    }

    public HashMap<Integer, Integer> getCampsiteIsBook(String userId, CampsiteEntity... campsites) {
        HashMap<Integer, Integer> result = new HashMap<>();

        for (CampsiteEntity campsite : campsites) {
            result.put(campsite.getIndex(), memberMapper.selectBookmarkByUserIdCampsiteIndex(userId, campsite.getIndex()));
        }
        return result;
    }

    public ReservationResult postReservation(UserEntity user, ReservationEntity reservation, String strStartDay, String strEndDay) throws ParseException {

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date startDay = sdf.parse(strStartDay);
        Date endDay = sdf.parse(strEndDay);
        if(user == null){
            return ReservationResult.FAILURE;
        }

        reservation.setUserIndex(user.getIndex())
                .setUserContact(user.getContact())
                .setUserId(user.getUserId())
                .setUserName(user.getName())
                .setStartDay(startDay)
                .setEndDay(endDay);

        if(this.memberMapper.selectReservationByStartDayToEndDaySiteCampsiteIndex(startDay,endDay, reservation.getSite(), reservation.getCampsiteIndex()) > 0){
            return ReservationResult.FAILURE_PROCESSING;
        }

        if(this.memberMapper.insertReservation(reservation) == 0){
            return ReservationResult.FAILURE;
        }
        return ReservationResult.SUCCESS;
    }

    public ReservationEntity[] getReservationList(int campsiteIndex, String site){
        return this.memberMapper.selectReservationByCampsiteIndexSite(campsiteIndex, site);
    }

    public ReservationEntity[] getReservations(int campsiteIndex, String userId){
        return memberMapper.selectReservations(campsiteIndex, userId);
    }
    public ReservationEntity getReservation(int index){
        return memberMapper.selectReservation(index);
    }

    public ReviewEntity[] getReviews(int campsiteIndex){
        return memberMapper.selectReviewsByCampsiteIndex(campsiteIndex);
    }

    public ReviewEntity getReview(int index){
        return memberMapper.selectReviewByIndex(index);
    }

    @Transactional
    public boolean postReview(ReviewEntity review, HttpServletRequest request, MultipartFile... multipartFiles) throws IOException {
        review.setClientIp(request.getRemoteAddr());
        review.setClientUa(request.getHeader("User-Agent"));

        if (memberMapper.insertReview(review) == 0) return false;

        if (multipartFiles != null){
            for (MultipartFile file : multipartFiles){
                ReviewImageEntity image = new ReviewImageEntity();
                image.setReviewIndex(review.getIndex());
                image.setName(file.getOriginalFilename());
                image.setSize((int)file.getSize());
                image.setContentType(file.getContentType());
                image.setData(file.getBytes());
                image.setClientIp(request.getRemoteAddr());
                image.setClientUa(request.getHeader("User-Agent"));

                if (memberMapper.insertReviewImage(image) == 0) return false;

            }
        }

        return true;
    }

    public boolean postModify(ReviewEntity review, HttpServletRequest request){
        ReviewEntity preReview = memberMapper.selectReviewByIndex(review.getIndex());

        review.setReservationIndex(preReview.getReservationIndex());
        review.setCampsiteIndex(preReview.getCampsiteIndex());
        review.setCreatedAt(preReview.getCreatedAt());
        review.setClientIp(request.getRemoteAddr());
        review.setClientUa(request.getHeader("User-Agent"));

        System.out.println(review.getReservationIndex()); //
        System.out.println(review.getCampsiteIndex()); //

        System.out.println(review.getCreatedAt()); //


        return memberMapper.updateReview(review) > 0;
//        return true;
    }

    public boolean deleteReview(int index){
        return memberMapper.deleteReview(index) > 0;
    }

    public int getCampsiteCountBySurvey(SurveyEntity survey, String areaName){
        return this.memberMapper.selectCampsiteCountBySurvey(survey, areaName);
    }

    public CampsiteEntity[] getCampsiteBySurvey(SurveyEntity survey, String areaName, int sort, PageModel pageModel){
        CampsiteEntity[] campsites = this.memberMapper.selectCampsiteBySurvey(survey, areaName, sort, pageModel);
        for (CampsiteEntity campsiteEntity : campsites) {
            convertCampsiteName(campsiteEntity);
            campsiteEntity.setNumberAd(convertCampsiteAd(campsiteEntity).get(campsiteEntity.getIndex()));
        }
        return campsites;
    }

}
