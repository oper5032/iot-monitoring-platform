package com.fds.external.repository.sub;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ExternalRepository {
	HashMap<String, Object> selectSmartMeteringCnt();
	List<HashMap<String, Object>> selectSmartMeteringCompanyList();
    List<HashMap<String, Object>> selectSmartMeteringList();
}