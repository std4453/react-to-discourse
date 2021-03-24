import DiscourseRoute from 'discourse/routes/discourse'

export default DiscourseRoute.extend({
    controllerName: "my",

    renderTemplate() {
        this.render("my");
    }
});