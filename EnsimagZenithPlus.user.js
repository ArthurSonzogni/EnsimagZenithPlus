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
        moyenne : 0.0,


        // methodes
        run : function() {
            this.addLineColor();
            this.calculMoyenne();
            this.addInformationPanel();
        },

        calculMoyenne : function() {
            var sumNote = 0;
            var sumCoef = 0;
            $("tbody tr").each( function(){

                var tds = $(this).children("td");
                var coef = parseFloat(tds.eq(1).text());
                var note = parseFloat(tds.eq(3).text());

                sumNote += coef * note;
                sumCoef += coef;
            });
            this.moyenne = sumNote/sumCoef;
        },

        addInformationPanel : function()
        {
            $("table").append("<h2><strong>Moyenne générale = "+this.moyenne.toFixed(2)+"</strong></h2>");
        },

        addLineColor : function()
        {
            $("tbody tr").each( function(){
                var tds = $(this).children("td");
                var note = parseFloat(tds.eq(3).text());
                if (note<8)         $(this).css("background-color","#FF3333");
                else if (note<10)   $(this).css("background-color","#FFAAAA");
                else if (note<12)   $(this).css("background-color","#FFB981");
                else if (note<14)   $(this).css("background-color","#CCFFA9");
                else if (note<16)   $(this).css("background-color","#76FF76");
                else                $(this).css("background-color","#009953");

            });
        },

        

    },

    homePage : {
        
        run : function() {

        },
    },
};

ZP.main();

})(jQuery);
