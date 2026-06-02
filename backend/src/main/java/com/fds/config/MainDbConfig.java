package com.fds.config;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

@Configuration
@MapperScan(
    basePackages = "com.fds.dashboard.repository.main",
    sqlSessionFactoryRef = "mainSqlSessionFactory"
)
public class MainDbConfig {

    @Bean(name = "mainDataSource")
    @Primary
    @ConfigurationProperties(prefix = "app.datasource.main")
    public DataSource mainDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "mainSqlSessionFactory")
    @Primary
    public SqlSessionFactory mainSqlSessionFactory(
            @Qualifier("mainDataSource") DataSource mainDataSource) throws Exception {

        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(mainDataSource);
        factoryBean.setMapperLocations(
            new PathMatchingResourcePatternResolver()
                .getResources("classpath:mapper/main/**/*.xml")
        );

        return factoryBean.getObject();
    }

    @Bean(name = "mainSqlSessionTemplate")
    @Primary
    public SqlSessionTemplate mainSqlSessionTemplate(
            @Qualifier("mainSqlSessionFactory") SqlSessionFactory mainSqlSessionFactory) {
        return new SqlSessionTemplate(mainSqlSessionFactory);
    }

    @Bean(name = "mainTransactionManager")
    @Primary
    public DataSourceTransactionManager mainTransactionManager(
            @Qualifier("mainDataSource") DataSource mainDataSource) {
        return new DataSourceTransactionManager(mainDataSource);
    }
}