library(readr)
library(haven)
library(dplyr)
library(tidyr)
library(stringr)
library(ggplot2)

acc2014 <- read_sas("Desktop/Github/DataViz/data/accident.sas7bdat")
acc2015 <- read_csv("Desktop/Github/DataViz/data/accident.csv")

class(acc2014)
class(acc2015)
