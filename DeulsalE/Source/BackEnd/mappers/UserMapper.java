package com.iforteam.deulsal_i.mappers;

import com.iforteam.deulsal_i.entities.UserEntity;
import com.iforteam.deulsal_i.entities.UserRecoverContactCodeEntity;
import com.iforteam.deulsal_i.entities.UserRecoverEmailCodeEntity;
import com.iforteam.deulsal_i.entities.UserRegisterContactCodeEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {

    // 유저 삽입
    int insertUser(UserEntity user);

    // 아이디 조회
    UserEntity selectUserById(@Param(value = "userId") String userId);

    // 이메일 조회
    UserEntity selectUserByEmail(@Param(value = "email") String email);

    // 연락처 조회
    UserEntity selectUserByContact(@Param(value = "contact") String contact);

    // 닉네임 조회
    UserEntity selectUserByNickname(@Param(value = "nickname") String nickname);

    // 이름과 연락처 조회
    UserEntity selectUserByNameAndContact(@Param("name") String name,
                                          @Param("contact") String contact);

    // 이름과 이메일 조회
    UserEntity selectUserByNameAndEmail(@Param("name") String name,
                                        @Param("email") String contact);

    // 아이디와 연락처 조회
    UserEntity selectUserByIdAndContact(@Param("userId") String userId,
                                        @Param("contact") String contact);

    // 아이디와 이메일 조회
    UserEntity selectUserByIdAndEmail(@Param("userId") String userId,
                                      @Param("email") String email);

    // 연락처, 코드, 솔트로 회원가입용 연락처 코드 조회
    UserRegisterContactCodeEntity selectRegisterContactCodeByContactCodeSalt(UserRegisterContactCodeEntity registerContactCode);

    // 새로운 회원가입용 연락처 인증번호 db 삽입
    int insertRegisterContactCode(UserRegisterContactCodeEntity userRegisterContactCode);

    // 회원가입용 연락처 인증번호 업데이트
    int updateRegisterContactCode(UserRegisterContactCodeEntity userRegisterContactCodeEntity);

    // 새로운 복구용 연락처 인증번호 db 삽입
    int insertRecoverContactCode(UserRecoverContactCodeEntity userRecoverContactCode);

    // 새로운 복구용 이메일 인증번호 db 삽입
    int insertRecoverEmailCode(UserRecoverEmailCodeEntity userRecoverEmailCode);

    // 연락처, 코드, 솔트를 기반으로 복구용 연락처 인증번호 조회
    UserRecoverContactCodeEntity selectRecoverContactCodeByContactCodeSalt(UserRecoverContactCodeEntity recoverContactCode);

    // 이메일, 코드, 솔트를 기반으로 복구용 이메일 인증번호 조회
    UserRecoverEmailCodeEntity selectRecoverEmailCodeByEmailCodeSalt(UserRecoverEmailCodeEntity recoverEmailCode);

    // 복구용 연락처 코드 정보를 업데이트
    int updateRecoverContactCode(UserRecoverContactCodeEntity recoverContactCode);

    // 복구용 이메일 코드 정보 업데이트
    int updateRecoverEmailCode(UserRecoverEmailCodeEntity recoverEmailCode);

    // 업데이트할 유저 정보
    int updateUser(UserEntity user);

    
}
