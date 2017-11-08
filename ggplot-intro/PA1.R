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
#Better change file name: accident_2014, accident_2015
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

#Merging on another data source
fips <- read_csv("fips.csv")
glimpse(fips)
acc$STATE <- as.character(acc$STATE)
acc$COUNTY <- as.character(acc$COUNTY)
acc$STATE <- str_pad(acc$STATE, 2, "left", "0")
acc$COUNTY <- str_pad(acc$COUNTY, 3, "left", "0")
##Can mutate multiple columns in one time
acc <- plyr::rename(acc, c("STATE" = "StateFIPSCode", "COUNTY" = "CountyFIPSCode"))
acc <- acc %>% left_join(fips) 
#Works if by columns exist in both sides. You need to check first. what if there
#is some more unexpected column names? Convention of coding is to make code more readable.


#Exploratory data analysis in R's dplyr and tidyr package
agg <- acc %>% group_by(StateName, YEAR)  %>% summarise(TOTAL = sum(FATALS))
agg_wide <- spread(agg, YEAR, TOTAL) %>% setNames( c("StateName", "Year2014", "Year2015") )
agg_diff <- mutate(agg_wide, Diff_Percent = Year2015/Year2014 - 1)
agg_arranged <- arrange(agg_diff, desc(Diff_Percent))
agg_filtered <- filter(agg_arranged, Diff_Percent > 0.15, !is.na(StateName))

#Rewrite using the chain operator
agg <- acc %>%
  group_by(StateName, YEAR) %>%
  summarise(TOTAL = sum(FATALS)) %>%
  spread(YEAR, TOTAL) %>%
  setNames(c("StateName", "Year2014", "Year2015")) %>%
  mutate(Diff_Percent = Year2015/Year2014 - 1) %>%
  arrange(desc(Diff_Percent)) %>%
  filter(Diff_Percent > 0.15, !is.na(StateName))
glimpse(agg)
