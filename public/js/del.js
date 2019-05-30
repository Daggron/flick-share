$('document').ready(function(){
    $('.del-post').on("click",function(e){
        $target=$(e.target);
        const id=$target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url:'/home/'+id,
            success:function(response){
                alert('Article Deleted');

                window.location.href('/');
            }
        })
    });

    $('.follow').on("click",function (e) {
        $target=$(e.target);
        const id=$target.attr('data-id');
        $.ajax({
            type:'POST',
            url:'/users/update/follow/'+id,
            success:function(response){
                alert('You started following');

                window.location.href('/users');
            }
        });
    });
});