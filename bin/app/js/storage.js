var fs = require('fs');
const path = require('path');

/**
 * 
 * @TODO use stream to rewrite the module
 */
class Storage {

    constructor(apath = "../../data") {
        this.path = path.join(__dirname, apath);
        this.dbfile = path.join(this.path,"./db");
        this.lock = true;
        this.data = {};
    }

    save() {
        var self = this;
        console.log(self.data);
        try {
            var data = JSON.stringify(self.data);
            if (!data) {
                data = {};
            }
        } catch(err){
            console.log("error when saving",err);
            return;
        }

        return new Promise(function (resolve, reject) {
            fs.writeFile(self.dbfile, data, function (err, file) {
                if (err) {
                    fs.mkdir(self.path,function(err,apath){

                    });
                    console.log('saving err',err);
                    reject(err);
                    return;
                }
                resolve(file);
            });
        });
    }

    load(doc) {
        return this.data[doc];
    }

    edited(doc, file) {
        this.data[doc] = file;
        this.save();
    }

    ready() {
        var self = this;
        return new Promise(function (resolve, reject) {
            fs.readFile(self.dbfile, function (err, data) {
                self.lock = false;
                if (err) {
                    console.log(err);
                    self.data["update"] = new Date();
                    self.save().then(function () {
                        resolve(self);
                    }).catch(function (err) {
                        console.log("write err", err);
                        reject(self);
                    });
                    return;
                }
                try{
                    self.data = JSON.parse(data);
                }catch(err){
                    console.log('err when parsing data',err);
                    self.data = JSON.parse("{}");
                }
                resolve(self);
            });
        });
    }

}

module.exports = Storage;