package com.iforteam.deulsal_i.services;

import com.iforteam.deulsal_i.entities.*;
import com.iforteam.deulsal_i.enums.EntrepreneurModifyResult;
import com.iforteam.deulsal_i.enums.EntrepreneurRegisterResult;
import com.iforteam.deulsal_i.mappers.EntrepreneurMapper;
import com.iforteam.deulsal_i.models.PageModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

@Service
public class EntrepreneurService {
    public static final int PAGE_COUNT = 10;
    private EntrepreneurMapper entrepreneurMapper;

    @Autowired
    public EntrepreneurService(EntrepreneurMapper entrepreneurMapper) {
        this.entrepreneurMapper = entrepreneurMapper;
    }

    public CampsiteEntity[] SearchName(PageModel pageModel, String searchCriterion) {
        return this.entrepreneurMapper.selectCampsiteByName(pageModel, searchCriterion);
    }

    public int getCampsiteCount(String name) {
        return this.entrepreneurMapper.selectCampsiteCount(name);
    }

    @Transactional
    public EntrepreneurRegisterResult registerEntrepreneur(HttpServletRequest request, CampsiteEntity campsite,int userIndex ,boolean isReservation, MultipartFile files) throws IOException {

        CampsiteEntity loadCampsite = this.entrepreneurMapper.selectCampsiteByIndexUserNull(campsite.getIndex());

        if (loadCampsite == null) {
            return EntrepreneurRegisterResult.FAILURE_PROCESSING;
        }

        loadCampsite.setUserIndex(userIndex)
                .setReservation(isReservation)
                .setCostList(campsite.getCostList());

        if (this.entrepreneurMapper.updateCampsite(loadCampsite) == 0) {
            return EntrepreneurRegisterResult.FAILURE;
        }

        CampsiteFileEntity campsiteFile = new CampsiteFileEntity()
                .setCampsiteIndex(loadCampsite.getIndex())
                .setCreatedAt(new Date())
                .setClientIp(request.getRemoteAddr())
                .setClientUa(request.getHeader("User-Agent"))
                .setFileName(files.getOriginalFilename())
                .setFileSize((int) files.getSize())
                .setFileContentType(files.getContentType())
                .setFileData(files.getBytes());

        if (this.entrepreneurMapper.insertCampsiteFile(campsiteFile) == 0) {
            return EntrepreneurRegisterResult.FAILURE;
        }
        return EntrepreneurRegisterResult.SUCCESS;
    }

    @Transactional
    public EntrepreneurRegisterResult newRegisterEntrepreneur(HttpServletRequest request, CampsiteEntity campsite, int userIndex, AdditionalFacilityEntity additionalFacility, PeripheralFacilityEntity peripheralFacility, GrampingFacilityEntity grampingFacility, boolean isReservation, MultipartFile... files) throws IOException {
        if (this.entrepreneurMapper.selectCampsiteByLatLng(campsite.getLatitude(), campsite.getLongitude()) != null) {
            return EntrepreneurRegisterResult.FAILURE_PROCESSING;
        }
        campsite.setUserIndex(userIndex);
        campsite.setReservation(isReservation);
        if (this.entrepreneurMapper.insertCampsite(campsite) == 0) {
            return EntrepreneurRegisterResult.FAILURE;
        }
        CampsiteEntity insertCampsite = this.entrepreneurMapper.selectCampsiteByLatLng(campsite.getLatitude(), campsite.getLongitude());
        additionalFacility.setCampsiteIndex(insertCampsite.getIndex());
        if (this.entrepreneurMapper.insertAdditionalFacility(additionalFacility) == 0) {
            return EntrepreneurRegisterResult.FAILURE;
        }
        peripheralFacility.setCampsiteIndex(insertCampsite.getIndex());
        if (this.entrepreneurMapper.insertPeripheralFacility(peripheralFacility) == 0) {
            return EntrepreneurRegisterResult.FAILURE;
        }
        grampingFacility.setCampsiteIndex(insertCampsite.getIndex());
        if (this.entrepreneurMapper.insertGrampingFacility(grampingFacility) == 0) {
            return EntrepreneurRegisterResult.FAILURE;
        }

        CampsiteFileEntity campsiteFile = new CampsiteFileEntity()
                .setCampsiteIndex(insertCampsite.getIndex())
                .setCreatedAt(new Date())
                .setClientIp(request.getRemoteAddr())
                .setClientUa(request.getHeader("User-Agent"))
                .setFileName(files[0].getOriginalFilename())
                .setFileSize((int) files[0].getSize())
                .setFileContentType(files[0].getContentType())
                .setFileData(files[0].getBytes());

        if (this.entrepreneurMapper.insertCampsiteFile(campsiteFile) == 0) {
            return EntrepreneurRegisterResult.FAILURE;
        }
        int inserted = 0;
        for (int i = 1; i < files.length; i++) {
            CampsiteImageEntity campsiteImage = new CampsiteImageEntity()
                    .setCampsiteIndex(insertCampsite.getIndex())
                    .setCreatedAt(new Date())
                    .setClientIp(request.getRemoteAddr())
                    .setClientUa(request.getHeader("User-Agent"))
                    .setImgName(files[i].getOriginalFilename())
                    .setImgSize((int) files[i].getSize())
                    .setImgContentType(files[i].getContentType())
                    .setImgData(files[i].getBytes());
            inserted += this.entrepreneurMapper.insertCampsiteImg(campsiteImage) == 0 ? 0 : 1;
        }
        if (inserted != files.length - 1) {
            return EntrepreneurRegisterResult.FAILURE;
        }
        return EntrepreneurRegisterResult.SUCCESS;
    }

    public CampsiteEntity[] getCampsiteByUserIndex(int userIndex) {
        return this.entrepreneurMapper.selectCampsiteByUserIndex(userIndex);
    }

    public AdditionalFacilityEntity getAdditionalFacilityByIndex(int campsiteIndex) {
        return this.entrepreneurMapper.selectAdditionalFacilityByIndex(campsiteIndex);
    }

    public PeripheralFacilityEntity getPeripheralFacilityByIndex(int campsiteIndex) {
        return this.entrepreneurMapper.selectPeripheralFacilityByIndex(campsiteIndex);
    }

    public GrampingFacilityEntity getGrampingFacilityByIndex(int campsiteIndex) {
        return this.entrepreneurMapper.selectGrampingFacilityByIndex(campsiteIndex);
    }

    public CampsiteImageEntity getCampsiteImg(int campsiteIndex, int index) {
        return this.entrepreneurMapper.selectCampsiteImageByIndex(campsiteIndex)[index];
    }

    public int getCampsiteImgCount(int campsiteIndex) {
        return this.entrepreneurMapper.selectCampsiteImageCountByIndex(campsiteIndex);
    }

    public int[] getCampsiteImgIndexByCampsiteIndex(int campsiteIndex) {
        return this.entrepreneurMapper.selectCampsiteImgIndexByCampsiteIndex(campsiteIndex);
    }

    @Transactional
    public EntrepreneurModifyResult modifyProfile(HttpServletRequest request, CampsiteEntity campsite, AdditionalFacilityEntity additionalFacility, PeripheralFacilityEntity peripheralFacility, GrampingFacilityEntity grampingFacility, int index, boolean isReservation, String[] deleteIndex, MultipartFile... files) throws IOException {
        CampsiteEntity exitingCampsite = this.entrepreneurMapper.selectCampsiteByIndex(index);
        if (exitingCampsite == null) {
            return EntrepreneurModifyResult.FAILURE_PROCESSING;
        }
        campsite.setIndex(index)
                .setUserIndex(exitingCampsite.getUserIndex())
                .setNumberAd(exitingCampsite.getNumberAd())
                .setRoadAd(exitingCampsite.getRoadAd())
                .setPortalRating(exitingCampsite.getPortalRating())
                .setRating(exitingCampsite.getRating())
                .setPortalReviewCnt(exitingCampsite.getPortalReviewCnt())
                .setReviewCnt(exitingCampsite.getReviewCnt())
                .setBookmarkCnt(exitingCampsite.getBookmarkCnt())
                .setCreatedAt(exitingCampsite.getCreatedAt())
                .setReservation(isReservation)
                .setDeleted(exitingCampsite.isDeleted())
                .setLatitude(exitingCampsite.getLatitude())
                .setLongitude(exitingCampsite.getLongitude());
        if (this.entrepreneurMapper.updateCampsite(campsite) == 0) {
            System.out.println("updateCampsite");
            return EntrepreneurModifyResult.FAILURE;
        }
        additionalFacility.setCampsiteIndex(index);
        if (this.entrepreneurMapper.updateAdditionalFacility(additionalFacility) == 0) {
            System.out.println("updateAdditionalFacility");
            return EntrepreneurModifyResult.FAILURE;
        }
        peripheralFacility.setCampsiteIndex(index);
        if (this.entrepreneurMapper.updatePeripheralFacility(peripheralFacility) == 0) {
            System.out.println("updatePeripheralFacility");
            return EntrepreneurModifyResult.FAILURE;
        }
        grampingFacility.setCampsiteIndex(index);
        if (this.entrepreneurMapper.updateGrampingFacility(grampingFacility) == 0) {
            System.out.println("updateGrampingFacility");
            return EntrepreneurModifyResult.FAILURE;
        }

        int deleted = 0;
        if (!deleteIndex[0].equals("0")) {
            for (int i = 0; i < deleteIndex.length; i++) {
                deleted += this.entrepreneurMapper.deleteCampsiteImg(Integer.parseInt(deleteIndex[i])) == 0 ? 0 : 1;
            }
            if (deleted != deleteIndex.length) {
                System.out.println("deleteCampsiteImg");
                return EntrepreneurModifyResult.FAILURE;
            }
        }

        int inserted = 0;
        if(files != null) {
            for (int i = 0; i < files.length; i++) {
                CampsiteImageEntity campsiteImage = new CampsiteImageEntity()
                        .setCampsiteIndex(index)
                        .setCreatedAt(new Date())
                        .setClientIp(request.getRemoteAddr())
                        .setClientUa(request.getHeader("User-Agent"))
                        .setImgName(files[i].getOriginalFilename())
                        .setImgSize((int) files[i].getSize())
                        .setImgContentType(files[i].getContentType())
                        .setImgData(files[i].getBytes());
                inserted += this.entrepreneurMapper.insertCampsiteImg(campsiteImage) == 0 ? 0 : 1;
            }
            if (inserted != files.length) {
                System.out.println("CampsiteImage");
                return EntrepreneurModifyResult.FAILURE;
            }
        }
        return EntrepreneurModifyResult.SUCCESS;
    }

    public EventImageEntity putEventImage(HttpServletRequest request, MultipartFile file) throws IOException {
        EventImageEntity image = new EventImageEntity() {{
            setName(file.getOriginalFilename());
            setSize((int) file.getSize());
            setContentType(file.getContentType());
            setData(file.getBytes());
            setCreatedAt(new Date());
            setClientIp(request.getRemoteAddr());
            setClientUa(request.getHeader("User-Agent"));
        }};
        this.entrepreneurMapper.insertEventImg(image);
        return image;
    }

    public EventImageEntity getEventImage(int index) {
        return this.entrepreneurMapper.selectEventImageByIndex(index);
    }

    public EventEntity[] getEvent(int userIndex) {
        return this.entrepreneurMapper.selectEventByUserIndex(userIndex);
    }

    @Transactional
    public boolean registrationEvent(HttpServletRequest request, int userIndex, EventEntity event, String sDay, String eDay, String src, MultipartFile... files) throws ParseException, IOException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date startDay = sdf.parse(sDay);
        Date endDay = sdf.parse(eDay);
        CampsiteEntity campsite = this.entrepreneurMapper.selectCampsiteByIndex(event.getCampsiteIndex());

        event.setStartDay(startDay)
                .setCampsiteName(campsite.getName())
                .setEndDay(endDay)
                .setUserIndex(userIndex)
                .setSrc(src)
                .setClientIp(request.getRemoteAddr())
                .setClientUa(request.getHeader("User-Agent"));

        if (this.entrepreneurMapper.insertEvent(event) == 0) {
            return false;
        }

        if (files != null) {
            if(!putEventFiles(request, event.getIndex(), files))
                return false;
        }
        return true;
    }

    @Transactional
    public boolean modifyEvent(HttpServletRequest request, EventEntity event, String sDay, String eDay, String src, int addFileMode, MultipartFile... files) throws ParseException, IOException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date startDay = sdf.parse(sDay);
        Date endDay = sdf.parse(eDay);

        EventEntity exitEvent = this.entrepreneurMapper.selectEventByIndex(event.getIndex());

        event.setStartDay(startDay)
                .setCampsiteIndex(exitEvent.getCampsiteIndex())
                .setCampsiteName(exitEvent.getCampsiteName())
                .setEndDay(endDay)
                .setUserIndex(exitEvent.getUserIndex())
                .setSrc(src)
                .setClientIp(request.getRemoteAddr())
                .setClientUa(request.getHeader("User-Agent"));

        int prevFileCount = this.entrepreneurMapper.selectEventFileCountByIndex(event.getIndex());

        if (this.entrepreneurMapper.updateEvent(event) == 0) {
            System.out.println("updateEvent Fail");
            return false;
        }

        if ((addFileMode == 2 || addFileMode == 3) && prevFileCount > 0) {
            if (this.entrepreneurMapper.deleteEventFile(event.getIndex()) == 0) {
                System.out.println("addFileMode : " + addFileMode);
                return false;
            }
        }

        if (addFileMode == 3 || addFileMode == 4){
            if(!putEventFiles(request, event.getIndex(), files)) {
                System.out.println("addFileMode : " + addFileMode);
                return false;
            }
        }

        return true;
    }

    public boolean putEventFiles(HttpServletRequest request, int index, MultipartFile... files) throws IOException {
        int inserted = 0;
        for (MultipartFile file : files) {
            EventFileEntity eventFile = new EventFileEntity() {{
                setEventIndex(index);
                setFileName(file.getOriginalFilename());
                setFileSize((int) file.getSize());
                setFileContentType(file.getContentType());
                setFileData(file.getBytes());
                setCreatedAt(new Date());
                setClientIp(request.getRemoteAddr());
                setClientUa(request.getHeader("User-Agent"));
            }};
            inserted += this.entrepreneurMapper.insertEventFile(eventFile) == 0 ? 0 : 1;
        }
        if (inserted != files.length) {
            return false;
        }
        return true;
    }

    public boolean deleteEvent(int eventIndex){
        return this.entrepreneurMapper.deleteEvent(eventIndex) > 0;
    }

    public ReservationEntity[] getReservation(UserEntity user, PageModel pageModel){
        CampsiteEntity[] campsites = this.entrepreneurMapper.selectCampsiteByUserIndex(user.getIndex());
        ArrayList<Integer> campsiteIndexList = new ArrayList<>();
        for (int i = 0; i < campsites.length; i++){
            campsiteIndexList.add(campsites[i].getIndex());
        }
        ReservationEntity[] reservations = null;
        if(!campsiteIndexList.isEmpty()){
            reservations = this.entrepreneurMapper.selectReservationByCampsiteIndex(campsiteIndexList, pageModel);
        }
        return reservations;
    }

    public ReservationEntity[] getDeposit(UserEntity user, PageModel pageModel){
        CampsiteEntity[] campsites = this.entrepreneurMapper.selectCampsiteByUserIndex(user.getIndex());
        ArrayList<Integer> campsiteIndexList = new ArrayList<>();
        for (int i = 0; i < campsites.length; i++){
            campsiteIndexList.add(campsites[i].getIndex());
        }
        ReservationEntity[] reservations = null;
        if(!campsiteIndexList.isEmpty()){
            reservations = this.entrepreneurMapper.selectDepositByCampsiteIndex(campsiteIndexList, pageModel);
        }
        return reservations;
    }

    public ReservationEntity[] getReservationAll(UserEntity user, PageModel pageModel){
        CampsiteEntity[] campsites = this.entrepreneurMapper.selectCampsiteByUserIndex(user.getIndex());
        ArrayList<Integer> campsiteIndexList = new ArrayList<>();
        for (int i = 0; i < campsites.length; i++){
            campsiteIndexList.add(campsites[i].getIndex());
        }
        ReservationEntity[] reservations = null;
        if(!campsiteIndexList.isEmpty()){
            reservations = this.entrepreneurMapper.selectReservationAllByCampsiteIndex(campsiteIndexList, pageModel);
        }
        return reservations;
    }

    public int getReservationCount(UserEntity user){
        CampsiteEntity[] campsites = this.entrepreneurMapper.selectCampsiteByUserIndex(user.getIndex());
        ArrayList<Integer> campsiteIndexList = new ArrayList<>();
        for (int i = 0; i < campsites.length; i++){
            campsiteIndexList.add(campsites[i].getIndex());
        }
        int count = 0;
        if(!campsiteIndexList.isEmpty()){
            count = this.entrepreneurMapper.selectReservationCountByCampsiteIndex(campsiteIndexList);
        }
        return count;
    }

    public int getDepositCount(UserEntity user){
        CampsiteEntity[] campsites = this.entrepreneurMapper.selectCampsiteByUserIndex(user.getIndex());
        ArrayList<Integer> campsiteIndexList = new ArrayList<>();
        for (int i = 0; i < campsites.length; i++){
            campsiteIndexList.add(campsites[i].getIndex());
        }
        int count = 0;
        if(!campsiteIndexList.isEmpty()){
            count = this.entrepreneurMapper.selectDepositCountByCampsiteIndex(campsiteIndexList);
        }
        return count;
    }

    public int getReservationAllCount(UserEntity user){
        CampsiteEntity[] campsites = this.entrepreneurMapper.selectCampsiteByUserIndex(user.getIndex());
        ArrayList<Integer> campsiteIndexList = new ArrayList<>();
        for (int i = 0; i < campsites.length; i++){
            campsiteIndexList.add(campsites[i].getIndex());
        }
        int count = 0;
        if(!campsiteIndexList.isEmpty()){
            count = this.entrepreneurMapper.selectAllCountByCampsiteIndex(campsiteIndexList);
        }
        return count;
    }

    public boolean setReservationStatus(int index, int status){
        ReservationEntity reservation = this.entrepreneurMapper.selectReservationByIndex(index);
        reservation.setStatus(status);
        return this.entrepreneurMapper.updateReservation(reservation) > 0;
    }
}
