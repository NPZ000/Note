from time import sleep
from selenium import webdriver

driver = webdriver.Chrome()
driver.get('http://www.baidu.com/') 
sleep(10)