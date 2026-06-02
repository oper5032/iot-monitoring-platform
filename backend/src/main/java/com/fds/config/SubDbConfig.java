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
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

@Configuration
@MapperScan(
    basePackages = "com.fds.external.repository.sub",
    sqlSessionFactoryRef = "subSqlSessionFactory"
)
public class SubDbConfig {

    @Bean(name = "subDataSource")
    @ConfigurationProperties(prefix = "app.datasource.sub")
    public DataSource subDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "subSqlSessionFactory")
    public SqlSessionFactory subSqlSessionFactory(
            @Qualifier("subDataSource") DataSource subDataSource) throws Exception {

        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(subDataSource);
        factoryBean.setMapperLocations(
            new PathMatchingResourcePatternResolver()
                .getResources("classpath:mapper/sub/**/*.xml")
        );

        return factoryBean.getObject();
    }

    @Bean(name = "subSqlSessionTemplate")
    public SqlSessionTemplate subSqlSessionTemplate(
            @Qualifier("subSqlSessionFactory") SqlSessionFactory subSqlSessionFactory) {
        return new SqlSessionTemplate(subSqlSessionFactory);
    }

    @Bean(name = "subTransactionManager")
    public DataSourceTransactionManager subTransactionManager(
            @Qualifier("subDataSource") DataSource subDataSource) {
        return new DataSourceTransactionManager(subDataSource);
    }
}