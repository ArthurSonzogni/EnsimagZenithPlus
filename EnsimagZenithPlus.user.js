// ==UserScript==
// @name        EnsimagZenithPlus
// @namespace   https://intranet.ensimag.fr/Zenith2/
// @description Amélioration du Zenith de l'ensimag
// @include     https://intranet.ensimag.fr/Zenith2/*
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
        // fonction globale
        this.global.run();

        // fonctions de la page
        if (document.URL.indexOf("ConsultNotes") != -1)
        {
            this.consultNote.run();
        }
        else if (document.URL.indexOf("Passwords") != -1)
        {

        }
        else if (document.URL.indexOf("Autre") != -1)
        {

        }
        else if (document.URL.indexOf("ConsultNotes") != -1)
        {
 
        }
        else
        {
            this.homePage.run();
        }
    },

    global : {
        run : function() {
            this.addOngletNote();
        },

        addOngletNote : function() {
            $("#header_liens").append("<li id=\"OngletNote\" class=\"\"><a href=\"/Zenith2/ConsultNotes?uid=\">Notes</a></li>");
        },
    },

    consultNote : {

        // attribut
        moyenne : 0.0,
        ecartType : 0.0,

        // methodes
        run : function() {
            this.cleanInterface();
            this.checkNewElement();
            this.updateView();
            //this.cascadeApparition();
            this.autoriserModifications();
            this.addButtonNewLine();
            this.setOngletActif();
            this.addCss();
        },

        updateView : function() {
            this.calculMoyenne();
            this.addInformationPanel();
            this.addLineColor();
            this.addLineButton();
        },

        calculMoyenne : function() {
            var sumNote = 0;
            var sumNote2 = 0;
            var sumCoef = 0;
            $("tbody tr").each( function(){

                var tds = $(this).children("td");
                if (tds.hasClass("noteDisable")) return;
                var coef = ZP.util.parseFloat(tds.eq(1).text());
                var note = ZP.util.parseFloat(tds.eq(3).text());

                sumNote2 += coef * note * note;
                sumNote += coef * note;
                sumCoef += coef;
            });
            this.moyenne = sumNote/sumCoef;
            this.ecartType = Math.sqrt(sumNote2/sumCoef-this.moyenne*this.moyenne);
        },

        addInformationPanel : function() {
            // suppression de l'ancien panneau
            $(".panelAdded").hide(1000,function(){
                $(this).remove();
            });
            // ajout du nouveau
            $(".cadre-gris").append("<div class='panelAdded'>"+
                    "<h2><strong>Moyenne générale = "+this.moyenne.toFixed(2)+"</strong></h2>"+
                    "<h3>(Ecart-type = "+this.ecartType.toFixed(2)+")</h3>"+
                    "</div>");
        },


        addLineColor : function() {
            $("tbody tr").each( function(){
                if ($(this).hasClass("noteDisable")) return;
                var tds = $(this).children("td");
                var note = ZP.util.parseFloat(tds.eq(3).text());
                if      (note<8)    $(this).css("background-color","#FF3333");
                else if (note<10)   $(this).css("background-color","#FFAAAA");
                else if (note<12)   $(this).css("background-color","#FFB981");
                else if (note<14)   $(this).css("background-color","#CCFFA9");
                else if (note<16)   $(this).css("background-color","#76FF76");
                else                $(this).css("background-color","#009953");
            });


            $("table td").css({padding:"10px"});
            $("table td").css({"padding-right":"10px"});
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
            $("tbody td").each(function(){
                // on selectionne les bonnes cases
                var i = $(this).index();
                switch(i){case 0:case 1:case 3:break;default:return;}

                $(this).off("click").on("click",function () {

                    // sauvegarde du contenu
                    var OriginalContent = $(this).text();

                    if ($(this).hasClass("cellEditing")) return;
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
            });
        },

        addButtonNewLine : function() {
            var that = this;
            $("table.perso.display").append("<button id=\"boutonNouvelleLigne\">nouvelle note (prévision)</button>");
            $("#boutonNouvelleLigne").click(function(){
                $("tbody").append("<tr class=\"prevision\"><td><b>(prévision)</b> "+prompt("Matière ?")+"</td><td>"+prompt("coefficient ?")+"</td><td>1</td><td>"+prompt("Note ?")+"</td><td></td></tr>");
                that.updateView();
                that.autoriserModifications();
            });
        },
        
        cleanInterface : function() {
            //$("#main").children().eq(0).remove();
            //$("#main").children().eq(1).remove();
            //$("#main").contents().filter(function() {
                    //return this.nodeType === 3;
            //}).remove();
        },

        setOngletActif : function() {
            $("#OngletNote").addClass("actif");
        },


        addLineButton : function() {
            var that = this;
            $("tbody tr").each(function(){
                var line = $(this);
                var cell = line.children("td").eq(4);
                
                cell.html("Menu <div class='menuList'><ul>"+
                    "<li class='menuListRemove'>Supprimer</li>"+
                    "<li class='menuListDisable'>Desactiver</li>"+
                    "<li class='menuListEnable'>Activer</li>"+
                    "</ul></div>");
                cell.addClass("buttonMenu");


                cell.find(".menuListRemove").off("click").on("click",function(){
                    line.animate({opacity:"0","font-size":"0px","padding":"0px","margin":"0px"},1000,function(){
                        line.remove();
                        that.updateView();
                    });
                });
                cell.find(".menuListDisable").off("click").on("click",function(){
                    line.find("td:not(:last-child)").addClass("noteDisable");
                    that.updateView();
                });
                cell.find(".menuListEnable").off("click").on("click",function(){
                    line.removeClass("noteDisable");
                    that.updateView();
                });

            });
        },

        addPopUp : function(cell,line) {
            $("table").append(
                $('<div class="menuPopUp"></div>')
                .append("bonjour")
                .offset(line.offset())
            );
        },
        

        addCss : function() {
            $("head").append(""+
                "<style>"+
                ".noteDisable"+
                "{"+
                "    background-color : #999;"+
                "}"+
                ".buttonMenu"+
                "{"+
                "    text-align : center;"+
                "    background-color : #EEE;"+
                "    width : 100px;"+
                "    box-shadow : inset 0 -1px 1px rgba(0,0,0,0.4);"+
                "    padding : 0px ;"+
                "    margin : 0px ;"+
                "}"+
                ".buttonMenu:hover"+
                "{"+
                "    background-color : #FFF;"+
                "    box-shadow : inset 0 0px 0px rgba(0,0,0,0.4);"+
                "}"+
                ".menuList"+
                "{"+
                "    position : absolute;"+
                "    width : 100px;"+
                "    background-color : transparent;"+
                "    display : none;"+
                "    padding : 0px ;"+
                "    margin : 0px ;"+
                "}"+
                ".menuList ul"+
                "{"+
                "    list-style : none;"+
                "    position : relative;"+
                "    width : 100px;"+
                "    left : -10px;"+
                "    top : +5px;"+
                "    padding-left : 10px ;"+
                "    padding-right : 10px ;"+
                "    padding-top : 5px ;"+
                "    padding-bottom : 5px ;"+
                "    margin : 0px ;"+
                "    background-color : #FFF;"+
                "    box-shadow : 0 10px 10px rgba(0,0,0,0.4);"+
                "}"+
                ".menuList li"+
                "{"+
                "    background-color : #EEE;"+
                "    padding : 10px ;"+
                "}"+
                ".menuList ul li:hover"+
                "{"+
                "    background-color : #BBB;"+
                "    box-shadow : inset 0 2px 2px rgba(0,0,0,0.4);"+
                "}"+
                ".buttonMenu:hover .menuList"+
                "{"+
                "    display : block;"+
                "}"+
                ".cadre-gris"+
                "{"+
                "    border:0px;"+
                "    padding-bottom:100px;"+
                "}"+
                "#footer"+
                "{"+
                "    display:none;"+
                "}"+
                "</style>"
            );
        },

    },

    homePage : {
        
        run : function() {

        },
    },

    util : {
        parseFloat : function(num){
            return parseFloat(num.replace(",","."));
        }
    }
};

ZP.main();

})(jQuery);
