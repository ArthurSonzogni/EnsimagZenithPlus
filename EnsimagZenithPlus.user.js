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
        ecartType : 0.0,

        // methodes
        run : function() {
            this.cleanInterface();
            this.updateView();
            this.checkNewElement();
            //this.cascadeApparition();
            this.autoriserModifications();
        },

        updateView : function() {
            this.calculMoyenne();
            this.addInformationPanel();
            this.addLineColor();
        },

        calculMoyenne : function() {
            var sumNote = 0;
            var sumNote2 = 0;
            var sumCoef = 0;
            $("tbody tr").each( function(){

                var tds = $(this).children("td");
                var coef = parseFloat(tds.eq(1).text());
                var note = parseFloat(tds.eq(3).text());

                sumNote2 += coef * note * note;
                sumNote += coef * note;
                sumCoef += coef;
            });
            this.moyenne = sumNote/sumCoef;
            this.ecartType = Math.sqrt(sumNote2/sumCoef-this.moyenne*this.moyenne);
        },

        addInformationPanel : function() {
            // suppression de l'ancien panneau
            $(".panelAdded").hide('slow',function(){
                $(this).remove();
            });
            // ajout du nouveau
            $("table").append("<h2 class='panelAdded'><strong>Moyenne générale = "+this.moyenne.toFixed(2)+"</strong></h2>");
            $("table").append("<h3 class='panelAdded'>(Ecart-type = "+this.ecartType.toFixed(2)+")</h3>");
        },


        addLineColor : function() {
            $("tbody tr").each( function(){
                var tds = $(this).children("td");
                var note = parseFloat(tds.eq(3).text());
                if      (note<8)    $(this).css("background-color","#FF3333");
                else if (note<10)   $(this).css("background-color","#FFAAAA");
                else if (note<12)   $(this).css("background-color","#FFB981");
                else if (note<14)   $(this).css("background-color","#CCFFA9");
                else if (note<16)   $(this).css("background-color","#76FF76");
                else                $(this).css("background-color","#009953");
            });


            $("table td").css({padding:"10px"});
        },

        checkNewElement : function() {
            if (typeof(Storage) != "undefined")
            {
                //localStorage.clear();
                $("tbody tr").each( function(){
                    var tds = $(this).children("td");
                    var matiere = tds.eq(0).text();
                    var note = tds.eq(3).text();
                    if (localStorage.getItem(matiere) !== note) {
                        tds.eq(0).append('<span style="color:#990000">  ( Nouveau ) </span> ');
                        $(this).css("font-weight","Bold");
                        localStorage.setItem(matiere,note);
                    }
                });
            }
        },

        cascadeApparition : function() {
            $('tbody tr').hide();
            $('tbody tr').first().show('fast', function showNextOne() {
                $(this).next('tr').show(50, showNextOne);
            });  
        },
        
        autoriserModifications : function() {
            var that = this;
            $("tbody td").click(function () {
                var OriginalContent = $(this).text();

                $(this).addClass("cellEditing");
                $(this).html("<input type='text' value='" + OriginalContent + "' />");
                $(this).children().first().focus();

                $(this).children().first().keypress(function (e) {
                    if (e.which == 13) {
                        var newContent = $(this).val();
                        $(this).parent().text(newContent);
                        $(this).parent().removeClass("cellEditing");
                        that.updateView();
                    }
                });

                $(this).children().first().blur(function(){
                    $(this).parent().text(OriginalContent);
                    $(this).parent().removeClass("cellEditing");
                    that.updateView();
                });
            });
        },
        
        cleanInterface : function() {
            //$("#main").children().eq(0).remove();
            //$("#main").children().eq(1).remove();
            //$("#main").contents().filter(function() {
                    //return this.nodeType === 3;
            //}).remove();
        },
        

    },

    homePage : {
        
        run : function() {

        },
    },
};

ZP.main();

})(jQuery);
