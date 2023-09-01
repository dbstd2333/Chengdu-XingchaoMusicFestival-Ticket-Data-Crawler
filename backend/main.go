package main

import (
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type YpLog struct {
	Id          int       `gorm:"column:id;type:int(11);comment:主键id;NOT NULL;primaryKey;uniqueIndex" json:"id"`
	YP102       int       `gorm:"type:int(11);" json:"yp102"`
	YP103       int       `gorm:"type:int(11);" json:"yp103"`
	YP1020103   int       `gorm:"type:int(11);" json:"yp1020103"`
	Price102    int       `gorm:"type:int(11);" json:"price102"`
	Price103    int       `gorm:"type:int(11);" json:"price103"`
	Price102103 int       `gorm:"type:int(11);" json:"price102103"`
	Time        time.Time `gorm:"type:datetime;" json:"time"`
}

type req struct {
	YP102       int `gorm:"type:int(11);" json:"yp102"`
	YP103       int `gorm:"type:int(11);" json:"yp103"`
	YP1020103   int `gorm:"type:int(11);" json:"yp1020103"`
	Price102    int `gorm:"type:int(11);" json:"price102"`
	Price103    int `gorm:"type:int(11);" json:"price103"`
	Price102103 int `gorm:"type:int(11);" json:"price102103"`
}

type resp struct {
	YP102   map[string]int    `json:"yp102"`
	YP103   map[string]int    `json:"yp103"`
	YP23    map[string]int    `json:"yp23"`
	Time    map[string]string `json:"time"`
	PreTime int               `json:"pretime"`
}

func main() {
	app := fiber.New()
	Mysql, err := gorm.Open(mysql.Open("你的mysql"), &gorm.Config{
		PrepareStmt:            true,
		SkipDefaultTransaction: true,
		Logger:                 logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		print(err.Error())
	} else {
		fmt.Println("ctx mysql connected")
		Mysql.AutoMigrate(&YpLog{})
	}
	app.Post("/api/log", func(c *fiber.Ctx) error {
		p := new(req)
		if err := c.BodyParser(p); err != nil {
			return err
		}
		Mysql.Table("yp_logs").Create(&YpLog{
			YP102:       p.YP102,
			YP103:       p.YP103,
			YP1020103:   p.YP1020103,
			Price102:    p.Price102,
			Price103:    p.Price103,
			Price102103: p.Price102103,
			Time:        time.Now(),
		})
		return c.SendString("ok")
	})
	app.Post("/api/getlog", func(c *fiber.Ctx) error {
		var p []YpLog
		Mysql.Table("yp_logs").Find(&p)
		r := new(resp)
		len := len(p)
		r.YP102 = make(map[string]int)
		r.YP103 = make(map[string]int)
		r.YP23 = make(map[string]int)
		r.Time = make(map[string]string)
		for i := 0; i < len; i++ {
			j := strconv.Itoa(i)
			r.YP102[j] = p[i].YP102
			r.YP103[j] = p[i].YP103
			r.YP23[j] = p[i].YP1020103
			r.Time[j] = p[i].Time.Format("2006-01-02 15:04:05")
		}
		return c.JSON(r)
	})

	log.Fatal(app.Listen(":9333"))
}
