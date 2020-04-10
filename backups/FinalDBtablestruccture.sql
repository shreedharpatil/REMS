-- MySQL dump 10.9
--
-- Host: localhost    Database: rems
-- ------------------------------------------------------
-- Server version	4.1.10

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

DROP DATABASE IF EXISTS REMS; 

 CREATE DATABASE REMS; 

 USE REMS; 

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `id` int(10) unsigned NOT NULL default '0',
  `name` varchar(30) default NULL,
  `contact_number` varchar(15) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Table structure for table `agent`
--

DROP TABLE IF EXISTS `agent`;
CREATE TABLE `agent` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `name` varchar(30) default NULL,
  `contact_number` varchar(15) default NULL,
  `address` varchar(60) default NULL,
  `image_url` varchar(60) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer` (
  `id` int(30) NOT NULL default '0',
  `name` varchar(30) default NULL,
  `contact_number` varchar(15) default NULL,
  `plot_number` int(11) default NULL,
  `address` varchar(60) default NULL,
  `image_url` varchar(60) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Table structure for table `customer_agent_mapping`
--

DROP TABLE IF EXISTS `customer_agent_mapping`;
CREATE TABLE `customer_agent_mapping` (
  `agent_id` int(11) default NULL,
  `customer_id` int(11) default NULL,
  KEY `fk_tab_customer_id` (`customer_id`),
  KEY `fk_tab_agent_id` (`agent_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Table structure for table `draw`
--

DROP TABLE IF EXISTS `draw`;
CREATE TABLE `draw` (
  `installment_number` int(11) default NULL,
  `membership_number` int(11) default NULL,
  `winning_date` date default NULL,
  `draw_type` varchar(10) default NULL,
  `draw_number` varchar(20) default NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Table structure for table `installment_payment`
--

DROP TABLE IF EXISTS `installment_payment`;
CREATE TABLE `installment_payment` (
  `transaction_id` int(11) default NULL,
  `customer_id` int(30) default NULL,
  `agent_id` int(30) default NULL,
  `receipt_id` varchar(30) default NULL,
  `paid_date` date default NULL,
  `paid_modified_date` date default NULL,
  `payment_status_flag` varchar(10) default NULL,
  `paid_amount` decimal(10,0) default NULL,
  `due_amount` decimal(10,0) default NULL,
  `total_installment_amount` decimal(10,0) default NULL,
  `installment_number` int(11) default NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
CREATE TABLE `login` (
  `user_name` varchar(30) NOT NULL default '',
  `password` varchar(30) NOT NULL default '',
  `user_type` varchar(10) default NULL,
  PRIMARY KEY  (`user_name`,`password`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Table structure for table `plot_layout`
--

DROP TABLE IF EXISTS `plot_layout`;
CREATE TABLE `plot_layout` (
  `number_of_plots` int(10) default NULL,
  `number_of_installments` int(10) default NULL,
  `initial_installment_amount` decimal(10,0) default NULL,
  `increment_interval` int(5) default NULL,
  `increment_amount` decimal(10,0) default NULL,
  `number_of_installments_lapsed` int(10) default NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Table structure for table `renewal`
--

DROP TABLE IF EXISTS `renewal`;
CREATE TABLE `renewal` (
  `application_installation_date` date default NULL,
  `application_renewal_date` date default NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
CREATE TABLE `transaction` (
  `transaction_id` int(10) unsigned NOT NULL auto_increment,
  `customer_id` int(30) default NULL,
  `agent_id` int(30) default NULL,
  `receipt_id` varchar(30) default NULL,
  `paid_date` date default NULL,
  `paid_amount` decimal(10,0) default NULL,
  PRIMARY KEY  (`transaction_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

