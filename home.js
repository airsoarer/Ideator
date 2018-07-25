(function(){
    $(document).ready(init);

    function init(){
        // $("#navSlide").on('click', navSlide);
        $(".dropdown-trigger").dropdown();
        $('.sidenav').sidenav();
        $('.modal-trigger').on('click', ideaModal);
    }

    function ideaModal(){
        $('#ideaModal').modal();
        $('#ideaModal').modal('open');
    }
})();