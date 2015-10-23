(function(){
	// Dodavanje komentara na stranici teme
	$('a.thumbnail').on('click', function(){
        $()
        var src = $(this).find('img').attr('src');
        $('.modal-body').html('<img src="' + src + '">');
      })
      $('#form-button').on('click', function(e){

        e.preventDefault();
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var komentar = $('#form-input').val();
        var html = '<tr>' + 
                      '<td class="korisnik">Korisnik <span class="date">' + day +  '.' + month  + '.' +  year  + '.</span></td>' + 
                      '<td>' + komentar+ '</td>' +
                    '</tr>'; 

        $('table.table').append(html);

        $('#form-input').val('');

      });
}())