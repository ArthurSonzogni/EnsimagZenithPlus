// ==UserScript==
// @name        EnsimagZenithPlus
// @namespace   https://intranet.ensimag.fr/Zenith2/
// @description Amélioration du Zenith de l'ensimag
// @include     https://intranet.ensimag.fr/Zenith2/
// @include     https://intranet.ensimag.fr/Zenith2/ConsultNotes?uid=*
// @version     1
// @grant       none
// ==/UserScript==

/*
 * Auteur : Arthur Sonzogni
 * Contributeur :
 */

( function($){

var ZP = {

    main : function() {
        if (document.URL.indexOf("ConsultNotes") != -1)
        {
            this.consultNote.run();
        }
        else
        {
            this.homePage.run();
        }
    },

    consultNote : {

        // attribut
        tableDOM : {},
        table : {},


        // methodes
        run : function() {
            this.parseTable();
        },

        parseTable : function() {
            var sumNote = 0;
            var sumCoef = 0;
            $("tbody tr").each( function(){

                var tds = $(this).children("td");
                var coef = parseFloat(tds.eq(1).text());
                var note = parseFloat(tds.eq(3).text());

                sumNote += coef * note;
                sumCoef += coef;
            });
            alert(sumNote/sumCoef);
        },
        

    },

    homePage : {
        
        run : function() {

        },
    },
};

ZP.main();

})(jQuery);
