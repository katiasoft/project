package com.iforteam.deulsal_i.configs;

import com.iforteam.deulsal_i.interceptors.MobileInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(this.mobileInterceptor())
                .addPathPatterns("/**")
                .excludePathPatterns("/resources/**")
                .excludePathPatterns("/user/**")
                .excludePathPatterns("/member/**").excludePathPatterns("/entrepreneur/**").excludePathPatterns("/help/**");
    }

    @Bean
    public MobileInterceptor mobileInterceptor() {
        return new MobileInterceptor();
    }
}
