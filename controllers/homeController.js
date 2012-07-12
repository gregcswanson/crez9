module.exports = HomeContoller;


function HomeContoller() {
}

HomeContoller.prototype = {

    index: function(req, res) {
        self = this;
        res.render('home/index.html', { title: 'Home ' });
    }

}