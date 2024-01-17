package com.iforteam.deulsal_i.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iforteam.deulsal_i.entities.*;
import com.iforteam.deulsal_i.enums.ReservationResult;
import com.iforteam.deulsal_i.models.PageModel;
import com.iforteam.deulsal_i.services.MemberService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Controller
@RequestMapping(value = "/member")
public class MemberController {

    private final MemberService memberService;

    @Autowired
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @RequestMapping(value = "format", method = RequestMethod.GET)
    public ModelAndView getFormat() {
        return new ModelAndView("member/format");
    }

    @RequestMapping(value = "recommendation", method = RequestMethod.GET)
    public ModelAndView getRecommendation() {
        return new ModelAndView("/member/recommendation");
    }

    @RequestMapping(value = "recommendation/list", method = RequestMethod.GET)
    public ModelAndView postRecommendation(HttpSession session, SurveyEntity survey, @RequestParam(value = "areaName") String areaName, @RequestParam(value = "page", required = false, defaultValue = "1") int requestPage, @RequestParam(value = "sort", required = false, defaultValue = "1") int sort) {

        ModelAndView modelAndView = new ModelAndView("member/list/recommendation");
        modelAndView.addObject("areaName", areaName);
        modelAndView.addObject("survey", survey);
        modelAndView.addObject("sort", sort);

        PageModel pageModel = new PageModel(
                15, memberService.getCampsiteCountBySurvey(survey, areaName), requestPage
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


    @RequestMapping(value = "review", method = RequestMethod.GET)
    public ModelAndView getReview(@RequestParam(value = "campsiteIndex", required = false, defaultValue = "0") int campsiteIndex, HttpSession session) {
        ModelAndView modelAndView = new ModelAndView("/member/review");
        modelAndView.addObject("campsiteIndex", campsiteIndex);
        modelAndView.addObject("reservations", memberService.getReservations(campsiteIndex, ((UserEntity) session.getAttribute("user")).getUserId()));
        modelAndView.addObject("reviews", memberService.getReviews(campsiteIndex));

        return modelAndView;
    }

    @RequestMapping(value = "review/write", method = RequestMethod.GET)
    public ModelAndView getWrite(@RequestParam(value = "reservationIndex", required = false, defaultValue = "0") int reservationIndex) {
        ModelAndView modelAndView = new ModelAndView("/member/write");
        modelAndView.addObject("reservationIndex", reservationIndex);

        ReservationEntity reservation = memberService.getReservation(reservationIndex);

        modelAndView.addObject("reservation", reservation);
        modelAndView.addObject("campsite", memberService.getCampsite(reservation.getCampsiteIndex()));

        return modelAndView;
    }

    @RequestMapping(value = "review/modify", method = RequestMethod.GET)
    public ModelAndView getModify(@RequestParam(value = "index", required = false, defaultValue = "0") int index) {
        ModelAndView modelAndView = new ModelAndView("/member/modify");
        modelAndView.addObject("index", index);

        ReviewEntity review = memberService.getReview(index);
        modelAndView.addObject("review", review);
        ReservationEntity reservation = memberService.getReservation(review.getReservationIndex());
        modelAndView.addObject("campsite", memberService.getCampsite(reservation.getCampsiteIndex()).getName());
        modelAndView.addObject("site", reservation.getSite());

        return modelAndView;
    }


    @RequestMapping(value = "review", method = RequestMethod.POST)
    @ResponseBody
    public String postReview(ReviewEntity review, HttpServletRequest request, HttpSession session, @RequestParam(value = "files", required = false) MultipartFile... file) throws IOException {

//        System.out.println(file.length);

        boolean result = memberService.postReview(review.setUserId(((UserEntity) session.getAttribute("user")).getUserId()), request, file);

        return "true";
    }

    @RequestMapping(value = "review", method = RequestMethod.PATCH)
    @ResponseBody
    public String patchReview(ReviewEntity review, HttpServletRequest request, HttpSession session) {

        boolean result = memberService.postModify(review.setUserId(((UserEntity) session.getAttribute("user")).getUserId()), request);

        return "true";
    }

    @RequestMapping(value = "review", method = RequestMethod.DELETE)
    @ResponseBody
    public String deleteReview(@RequestParam(value = "index") int index) {
        boolean result = memberService.deleteReview(index);
        return "true";
    }


    @RequestMapping(value = "campsite",
            method = RequestMethod.GET)
    public ModelAndView getCampsite(@RequestParam(value = "code", defaultValue = "1") int code,
                                    @RequestParam(value = "query", required = false, defaultValue = "") String query,
                                    @RequestParam(value = "sort", required = false, defaultValue = "1") int sort,
                                    @RequestParam(value = "page", required = false, defaultValue = "1") int requestPage,
                                    HttpSession session) {

        ModelAndView modelAndView = new ModelAndView("member/campsite");
        modelAndView.addObject("code", code);
        modelAndView.addObject("query", query);
        modelAndView.addObject("sort", sort);

        PageModel pageModel = new PageModel(
                15, memberService.getCampsitesCnt(code, sort, query), requestPage
        );

        CampsiteEntity[] campsites = memberService.getCampsitesByPage(code, sort, query, pageModel);

        modelAndView.addObject("campsitesByReview", memberService.getCampsitesByTop5(code, 2));
        modelAndView.addObject("campsitesByStar", memberService.getCampsitesByTop5(code, 3));
        modelAndView.addObject("campsitesByBook", memberService.getCampsitesByTop5(code, 4));

        modelAndView.addObject("campsites", campsites);
        modelAndView.addObject("campsiteCat", memberService.convertCampsiteCat(campsites));
        modelAndView.addObject("pageModel", pageModel);

        if (session.getAttribute("user") != null) {
            modelAndView.addObject("campsiteIsBook", memberService.getCampsiteIsBook(((UserEntity) session.getAttribute("user")).getUserId(), campsites));
        }

        return modelAndView;
    }


    @RequestMapping(value = "detail", method = RequestMethod.GET)
    public ModelAndView getDetail(@RequestParam(value = "index") int index,
                                  HttpSession session) {

        CampsiteEntity campsite = memberService.getCampsite(index);

        ModelAndView modelAndView = new ModelAndView("member/detail").addObject("campsite", campsite)
                .addObject("additionalFacility", memberService.getAdditionalFacility(index))
                .addObject("peripheralFacility", memberService.getPeripheralFacility(index))
                .addObject("grampingFacility", memberService.getGrampingFacility(index))
                .addObject("campsiteImages", memberService.getCampsiteImages(index));

        if (session.getAttribute("user") != null) {
            modelAndView.addObject("campsiteIsBook", memberService.getCampsiteIsBook(((UserEntity) session.getAttribute("user")).getUserId(), campsite));
        }

        return modelAndView;
    }

    @RequestMapping(value = "image/campsite", method = RequestMethod.GET)
    public ResponseEntity<byte[]> getImg(@RequestParam(value = "index") int index) {
        return memberService.getImage(index);
    }

    @RequestMapping(value = "image/campsiteMain", method = RequestMethod.GET)
    public ResponseEntity<byte[]> getMainImg(@RequestParam(value = "campsiteIndex") int campsiteIndex) {
        return memberService.getCampsiteMainImage(campsiteIndex);
    }


    @RequestMapping(value = "user", method = RequestMethod.POST)
    @ResponseBody
    public String postUserInfo(@RequestParam(value = "userId") String userId, @RequestParam(value = "campsiteIndex") int campsiteIndex) {
        return String.valueOf(memberService.postUserBookmarkCampsite(userId, campsiteIndex));
    }

    @RequestMapping(value = "bookmark", method = RequestMethod.POST)
    @ResponseBody
    public String postBookmark(@SessionAttribute(value = "user") UserEntity user, CampsiteBookmarkEntity campsiteBookmark) {
        return String.valueOf(memberService.postBookmark(campsiteBookmark.setUserId(user.getUserId())));
    }

    @RequestMapping(value = "bookmark", method = RequestMethod.DELETE)
    @ResponseBody
    public String deleteBookmark(@SessionAttribute(value = "user") UserEntity user, @RequestParam(value = "campsiteIndex") int campsiteIndex) {
        return String.valueOf(memberService.deleteBookmark(user.getUserId(), campsiteIndex));
    }

    @RequestMapping(value = "reservation", method = RequestMethod.GET)
    public ModelAndView getReservation(HttpSession session, @RequestParam(value = "index") int index) throws JsonProcessingException {

        UserEntity user = (UserEntity) session.getAttribute("user");

        if(user == null){
            return new ModelAndView("/user/login");
        }

        ModelAndView modelAndView = new ModelAndView("member/reservation");
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

    @RequestMapping(value = "reservation",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postReservation(HttpSession session, ReservationEntity reservation, @RequestParam(value = "strStartDay") String strStartDay, @RequestParam(value = "strEndDay") String strEndDay) throws ParseException {
        UserEntity user = (UserEntity) session.getAttribute("user");
        ReservationResult result = this.memberService.postReservation(user, reservation, strStartDay, strEndDay);

        JSONObject responseObject = new JSONObject() {{
            put("result", result.name().toLowerCase());
        }};

        return responseObject.toString();
    }

    @RequestMapping(value = "reservation/list",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getReservationList(@RequestParam(value = "campsiteIndex") int campsiteIndex, @RequestParam(value = "site") String site) throws ParseException {
        ReservationEntity[] reservations = this.memberService.getReservationList(campsiteIndex, site);

        ArrayList<Map<String, String>> dayLists = new ArrayList<>();

        for (int i = 0; i < reservations.length; i++) {
            Map<String, String> map = new HashMap<>();

            SimpleDateFormat recvSimpleFormat = new SimpleDateFormat("E MMM dd HH:mm:ss z yyyy", Locale.ENGLISH);

            // 여기에 원하는 포맷을 넣어주면 된다
            SimpleDateFormat tranSimpleFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);

            Date start = recvSimpleFormat.parse(reservations[i].getStartDay().toString());
            String strStart = tranSimpleFormat.format(start);

            Date end = recvSimpleFormat.parse(reservations[i].getEndDay().toString());
            String strEnd = tranSimpleFormat.format(end);

            map.put("startDay", strStart);
            map.put("endDay", strEnd);
            dayLists.add(i, map);
        }
        JSONObject responseObject = new JSONObject() {{
            put("dayLists", dayLists);
        }};
        return responseObject.toString();
    }
}


