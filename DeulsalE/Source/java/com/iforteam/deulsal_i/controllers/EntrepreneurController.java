package com.iforteam.deulsal_i.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iforteam.deulsal_i.entities.*;
import com.iforteam.deulsal_i.enums.EntrepreneurModifyResult;
import com.iforteam.deulsal_i.enums.EntrepreneurRegisterResult;
import com.iforteam.deulsal_i.models.PageModel;
import com.iforteam.deulsal_i.services.EntrepreneurService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.ParseException;
import java.util.Map;

@Controller
@RequestMapping(value = "/entrepreneur")
public class EntrepreneurController {
    private EntrepreneurService entrepreneurService;

    @Autowired
    public EntrepreneurController(EntrepreneurService entrepreneurService) {
        this.entrepreneurService = entrepreneurService;
    }

    @RequestMapping(value = "/registration", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getRegistration(HttpSession session, @RequestParam(value = "page", defaultValue = "1", required = false) int requestPage, @RequestParam(value = "sName", defaultValue = "", required = false) String searchCriterion) {
        ModelAndView modelAndView = new ModelAndView("entrepreneur/registration");

        UserEntity user = (UserEntity) session.getAttribute("user");
        if(user == null){
            modelAndView = new ModelAndView("user/login");
        }
        else{
            PageModel pageModel = new PageModel(
                    EntrepreneurService.PAGE_COUNT,
                    this.entrepreneurService.getCampsiteCount(searchCriterion),
                    requestPage
            );

            CampsiteEntity[] campsiteEntities = this.entrepreneurService.SearchName(pageModel, searchCriterion);

            modelAndView.addObject("campsites", campsiteEntities);
            modelAndView.addObject("searchCriterion", searchCriterion);
            modelAndView.addObject("pageModel", pageModel);
        }
        return modelAndView;
    }

    @RequestMapping(value = "/registration/register",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postRegister(HttpSession session, HttpServletRequest request, CampsiteEntity campsite, @RequestParam(value = "isReservation") boolean isReservation, @RequestParam(value = "files") MultipartFile files) throws IOException {
        UserEntity user = (UserEntity) session.getAttribute("user");

        EntrepreneurRegisterResult result = this.entrepreneurService.registerEntrepreneur(request, campsite, user.getIndex(),isReservation, files);
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};
        return responseObject.toString();
    }

    @RequestMapping(value = "/registration/newRegister",
            method = RequestMethod.POST)
    @ResponseBody
    public String postNewRegister(HttpSession session, HttpServletRequest request, CampsiteEntity campsite, AdditionalFacilityEntity additionalFacility, PeripheralFacilityEntity peripheralFacility, GrampingFacilityEntity grampingFacility, @RequestParam(value = "isReservation") boolean isReservation, @RequestParam(value = "files") MultipartFile... files) throws IOException {
        UserEntity user = (UserEntity) session.getAttribute("user");

        EntrepreneurRegisterResult result = this.entrepreneurService.newRegisterEntrepreneur(request, campsite, user.getIndex(), additionalFacility, peripheralFacility, grampingFacility, isReservation, files);
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};

        return responseObject.toString();
    }

    @RequestMapping(value = "/profile", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getProfile(HttpSession session, @RequestParam(value = "index", defaultValue = "0", required = false) int index) throws JsonProcessingException {
        ModelAndView modelAndView = new ModelAndView("entrepreneur/profile");
        UserEntity user = (UserEntity) session.getAttribute("user");
        if (user != null) {
            CampsiteEntity[] campsiteEntities = this.entrepreneurService.getCampsiteByUserIndex(user.getIndex());
            if (campsiteEntities != null && campsiteEntities.length != 0) {
                modelAndView.addObject("campsites", campsiteEntities);
                if (campsiteEntities[index].getCostList() != "" && campsiteEntities[index].getCostList() != null) {
                    ObjectMapper mapper = new ObjectMapper();
                    Map<String, String> costMap = mapper.readValue(campsiteEntities[index].getCostList(), Map.class);
                    modelAndView.addObject("costMap", costMap);
                }
                int campsiteIndex = campsiteEntities[index].getIndex();
                AdditionalFacilityEntity additionalFacility = this.entrepreneurService.getAdditionalFacilityByIndex(campsiteIndex);
                PeripheralFacilityEntity peripheralFacility = this.entrepreneurService.getPeripheralFacilityByIndex(campsiteIndex);
                GrampingFacilityEntity grampingFacility = this.entrepreneurService.getGrampingFacilityByIndex(campsiteIndex);
                int campsiteImgCount = this.entrepreneurService.getCampsiteImgCount(campsiteIndex);
                int[] campsiteImgIndex = this.entrepreneurService.getCampsiteImgIndexByCampsiteIndex(campsiteIndex);
                modelAndView.addObject("additionalFacility", additionalFacility);
                modelAndView.addObject("peripheralFacility", peripheralFacility);
                modelAndView.addObject("grampingFacility", grampingFacility);
                modelAndView.addObject("campsiteImgCount", campsiteImgCount);
                modelAndView.addObject("campsiteImgIndex", campsiteImgIndex);
                modelAndView.addObject("index", index);
            }
        } else {
            modelAndView = new ModelAndView("user/login");
        }
        return modelAndView;
    }

    @RequestMapping(value = "/profile/modify",
            method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postModifyProfile(HttpServletRequest request, CampsiteEntity campsite, AdditionalFacilityEntity additionalFacility, PeripheralFacilityEntity peripheralFacility, GrampingFacilityEntity grampingFacility, @RequestParam(value = "campsiteIndex") int index, @RequestParam(value = "isReservation") boolean isReservation, @RequestParam(value = "deleteIndex") String[] deleteIndex, @RequestParam(value = "files", required = false) MultipartFile... files) throws IOException {
        EntrepreneurModifyResult result = this.entrepreneurService.modifyProfile(request, campsite, additionalFacility, peripheralFacility, grampingFacility, index, isReservation, deleteIndex, files);
        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};

        return responseObject.toString();
    }

    @RequestMapping(value = "/profile/image",
            method = RequestMethod.GET)
    public ResponseEntity<byte[]> getCampsiteImg(@RequestParam(value = "campsiteIndex") int campsiteIndex, @RequestParam(value = "index") int index) {
        CampsiteImageEntity campsiteImage = this.entrepreneurService.getCampsiteImg(campsiteIndex, index);
        ResponseEntity<byte[]> response;
        if (campsiteImage == null) {
            response = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentLength(campsiteImage.getImgData().length);
            headers.setContentType(MediaType.parseMediaType(campsiteImage.getImgContentType()));
            response = new ResponseEntity<>(campsiteImage.getImgData(), headers, HttpStatus.OK);
        }
        return response;
    }

    @RequestMapping(value = "/reservation", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getReservation(HttpSession session, @RequestParam(value = "page", defaultValue = "1", required = false) int requestPage) {
        UserEntity user = (UserEntity) session.getAttribute("user");
        if (user == null) {
            return new ModelAndView("user/login");
        }

        PageModel pageModel = new PageModel(
                EntrepreneurService.PAGE_COUNT,
                this.entrepreneurService.getReservationCount(user),
                requestPage
        );

        ModelAndView modelAndView = new ModelAndView("/entrepreneur/reservation");
        ReservationEntity[] reservations = this.entrepreneurService.getReservation(user, pageModel);
        if(reservations != null) {
            modelAndView.addObject("reservations", reservations);
        }
        modelAndView.addObject("pageModel", pageModel);
        return modelAndView;
    }

    @RequestMapping(value = "/reservation/deposit", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getDeposit(HttpSession session, @RequestParam(value = "page", defaultValue = "1", required = false) int requestPage) {
        UserEntity user = (UserEntity) session.getAttribute("user");
        if (user == null) {
            return new ModelAndView("user/login");
        }
        PageModel pageModel = new PageModel(
                EntrepreneurService.PAGE_COUNT,
                this.entrepreneurService.getDepositCount(user),
                requestPage
        );

        ModelAndView modelAndView = new ModelAndView("/entrepreneur/depositList");
        ReservationEntity[] reservations = this.entrepreneurService.getDeposit(user, pageModel);
        if(reservations != null)
            modelAndView.addObject("reservations",reservations);
        modelAndView.addObject("pageModel", pageModel);
        return modelAndView;
    }

    @RequestMapping(value = "/reservation/list", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getReservationList(HttpSession session, @RequestParam(value = "page", defaultValue = "1", required = false) int requestPage) {
        UserEntity user = (UserEntity) session.getAttribute("user");
        if (user == null) {
            return new ModelAndView("user/login");
        }
        PageModel pageModel = new PageModel(
                EntrepreneurService.PAGE_COUNT,
                this.entrepreneurService.getReservationAllCount(user),
                requestPage
        );
        ModelAndView modelAndView = new ModelAndView("/entrepreneur/reservationList");
        ReservationEntity[] reservations = this.entrepreneurService.getReservationAll(user, pageModel);
        if(reservations != null)
            modelAndView.addObject("reservations",reservations);
        modelAndView.addObject("pageModel", pageModel);
        return modelAndView;
    }

    @RequestMapping(value = "/reservation/decision",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getReservationDecision(@RequestParam(value = "index") int index, @RequestParam(value = "status") int status){
        boolean result = this.entrepreneurService.setReservationStatus(index, status);
        return String.valueOf(result);
    }

    @RequestMapping(value = "/event", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getEvent(HttpSession session) {
        UserEntity user = (UserEntity) session.getAttribute("user");
        if (user == null) {
            return new ModelAndView("user/login");
        }
        ModelAndView modelAndView = new ModelAndView("/entrepreneur/event");
        CampsiteEntity[] campsites = this.entrepreneurService.getCampsiteByUserIndex(user.getIndex());

        modelAndView.addObject("campsites", campsites);

        return modelAndView;
    }

    @RequestMapping(value = "/event/modify", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getEventModify(HttpSession session, @RequestParam(value = "index", required = false, defaultValue = "0") int index) {
        UserEntity user = (UserEntity) session.getAttribute("user");
        if (user == null) {
            return new ModelAndView("user/login");
        }
        ModelAndView modelAndView = new ModelAndView("/entrepreneur/modify/event");
        EventEntity[] events = this.entrepreneurService.getEvent(user.getIndex());
        modelAndView.addObject("events", events);
        modelAndView.addObject("index", index);
        return modelAndView;
    }

    @RequestMapping(value = "/event/uploadImage",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postUploadImage(HttpServletRequest request,
                                  @RequestParam(value = "upload") MultipartFile file) throws IOException {
        EventImageEntity image = this.entrepreneurService.putEventImage(request, file);
        JSONObject responseObject = new JSONObject() {{
            put("url", "/entrepreneur/event/downloadImage?index=" + image.getIndex());
        }};
        return responseObject.toString();
    }

    @RequestMapping(value = "/event/downloadImage",
            method = RequestMethod.GET)
    public ResponseEntity<byte[]> getDownloadImage(@RequestParam(value = "index") int index) {
        EventImageEntity result = this.entrepreneurService.getEventImage(index);
        ResponseEntity<byte[]> response;
        if (result == null) {
            response = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentLength(result.getSize());
            headers.setContentType(MediaType.parseMediaType(result.getContentType()));
            response = new ResponseEntity<>(result.getData(), headers, HttpStatus.OK);
        }
        return response;
    }

    @RequestMapping(value = "/event/registration", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postEventRegistration(HttpServletRequest request, HttpSession session, EventEntity event, @RequestParam(value = "strStartDay") String sDay, @RequestParam(value = "strEndDay") String eDay, @RequestParam(value = "src", required = false, defaultValue = "") String src, @RequestParam(value = "files", required = false) MultipartFile... files) throws ParseException, IOException {
        UserEntity user = (UserEntity) session.getAttribute("user");
        boolean result = this.entrepreneurService.registrationEvent(request, user.getIndex(), event, sDay, eDay, src, files);
        return String.valueOf(result);
    }
    @RequestMapping(value = "/event/modify", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postModifyEvent(HttpServletRequest request, EventEntity event, @RequestParam(value = "strStartDay") String sDay, @RequestParam(value = "strEndDay") String eDay, @RequestParam(value = "src", required = false, defaultValue = "") String src,@RequestParam(value = "addFileMode") int addFileMode ,@RequestParam(value = "files", required = false) MultipartFile... files) throws ParseException, IOException {

        return String.valueOf(this.entrepreneurService.modifyEvent(request, event, sDay, eDay, src, addFileMode, files));
    }

    @RequestMapping(value = "/event/delete",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postDeleteEvent(@RequestParam(value = "eventIndex") int eventIndex){
        boolean result = this.entrepreneurService.deleteEvent(eventIndex);
        return String.valueOf(result);
    }

}
