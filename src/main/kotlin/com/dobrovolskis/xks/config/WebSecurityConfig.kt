package com.dobrovolskis.xks.config

import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter

/**
 * @author Vitalijus Dobrovolskis
 * @since 2020.06.11
 */
@EnableWebSecurity
class WebSecurityConfig : WebSecurityConfigurerAdapter() {

	override fun configure(http: HttpSecurity) {
		http.cors().and().csrf().disable()
	}
}