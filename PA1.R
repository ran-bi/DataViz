#Data Viz Assignment: R & Git
#Ran Bi
#The file is an exploratory analysis of the DoT FARS data

#Load libraries
library(readr)
library(haven)
library(dplyr)
library(tidyr)
library(stringr)
library(ggplot2)

#Load the FARS data
acc2014 <- read_sas("accident.sas7bdat")
acc2015 <- read_csv("accident.csv")

class(acc2014)
class(acc2015)

#Combining the two years of FARS data
acc2014 <-  acc2014 %>% mutate(TWAY_ID2 = replace(TWAY_ID2, TWAY_ID2=="", NA))
table(is.na(acc2014$TWAY_ID2))
dim(acc2014)
dim(acc2015)

colnames(acc2014) [colnames(acc2014) %in% colnames(acc2015) == FALSE]
#"ROAD_FNC" is missing from acc2015
colnames(acc2015) [colnames(acc2015) %in% colnames(acc2014) == FALSE]
#"RUR_URB"  "FUNC_SYS" "RD_OWNER" are missing from acc2014

acc <- bind_rows(acc2014, acc2015)
count(acc, RUR_URB)
#NA Values: Because RUR_URB variable is missing from acc2014. 
#The number of NA equals to the number of observations in acc2014.

#Mergingo n another data source
fips <- read_csv("fips.csv")
glimpse(fips)
acc$STATE <- as.character(acc$STATE)
acc$COUNTY <- as.character(acc$COUNTY)
acc$STATE <- str_pad(acc$STATE, 2, "left", "0")
acc$COUNTY <- str_pad(acc$COUNTY, 3, "left", "0")
acc <- plyr::rename(acc, c("STATE" = "StateFIPSCode", "COUNTY" = "CountyFIPSCode"))
acc %>% left_join(fips)
