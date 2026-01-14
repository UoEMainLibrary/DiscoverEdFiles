$(function() {
	// Make Request tab open in same window
        $('li.EXLRequestTab a').removeAttr('target');

        $('li.EXLRequestTab').removeClass('EXLResultTabIconPopout');

		////////////////////////////////////////////
		// Aspire Reading Lists
		// Get reading lists this item appears on.
		
		// baseurl - url of Aspire tenancy 
		// outputstringprefix - html to add to front of list items in the Primo links list
		// outputstringsuffix - html to add to end of list items in the Primo links list
		// detailstabid - the css identifier of the details tab. #exlidResult-1-TabContent for the full details page
		var aspire = {
			baseurl : 'http://resourcelists.ed.ac.uk/',
			urlsuffix : '/lists.json?cb=?',
			outputstringprefix : '<li><span class="EXLDetailsLinksBullet"></span><span class="EXLDetailsLinksTitle"><a href="',
			outputstringsuffix : '</a></span></li>',
			detailstabid : '#exlidResult-1-TabContent'
		};
		
		// call back function. allows call to external API. 
		// if called will add html for links to reading lists.
		AspireCallBack=function(data){
			if(data){
				var count=0;
				jQuery.each(data, function(uri,name){
					if(count<5){
						$(aspire.detailstabid + ' .EXLDetailsLinks ul').append(
							aspire.outputstringprefix+uri+'">Resource List: '+name+aspire.outputstringsuffix);
					}
					count=count+1;
				});
					
			}
		}

	
		// see if we can get some isbns from the page
		var getAspireISBNs=function(cssid){
			aspire.isbn = "";
			aspire.identifierfield = $(cssid).text();
			aspire.isbn10 = /ISBN (\d{9}[\d|X])/.exec(aspire.identifierfield);
			aspire.isbn13 = /ISBN (\d{12}[\d|X])/.exec(aspire.identifierfield);
			//console.log('getAspireISBN id field ' + aspire.identifierfield);
			if (aspire.isbn13) {
				aspire.isbn = aspire.isbn13[1];
			} else if(aspire.isbn10) {
				aspire.isbn = aspire.isbn10[1];
			} else if(cssid == "#Identifier0") {
				// this is messy. From search results, if user clicks on title
				// then they are taken to page where all id numbering goes to hell
				// the details tab button will be numbered 0 but the content will not
				var detailstab2 = $(".EXLDetailsContent").text();
				aspire.isbn = /ISBN (\d{12}[\d|X])/.exec(detailstab2);
				if (!aspire.isbn) {
					aspire.isbn = /ISBN (\d{9}[\d|X])/.exec(detailstab2);
				}
				// adding check to see is isbn is null or not.
				if (aspire.isbn !== null) {
				aspire.isbn = aspire.isbn[1];
				} else {
				console.log ('isbn is null');
				}
				console.log ('no isbn found in identifier, but found in detailscontent ' + aspire.isbn);
			}
			console.log("this is getAspireISBN " + aspire.isbn + " id field " + cssid);
		}
		
		// see if we can get a doi from the display tab
		var getAspireDOI=function(cssid){
			aspire.doi = "";
			aspire.doiraw = "";
			//var cssid = "#Identifier1";
			aspire.identifierfield = $(cssid).text();
			aspire.doiraw = /dx\.doi\.org\/([^\s]+)/.exec(aspire.identifierfield);
			aspire.doiraw2 = /DOI: ([^\s]+)/.exec(aspire.identifierfield);
			if (aspire.doiraw) {
				console.log('doi1 ' + aspire.doiraw[1]);
				aspire.doi = aspire.doiraw[1];
			}
			else if (aspire.doiraw2) {
				aspire.doiraw = /DOI: ([^\s]+)/.exec(aspire.identifierfield);
				console.log('doi2 ' + aspire.doiraw[1]);
				aspire.doi = aspire.doiraw2[1]
			} 
		}
		
		// connect to Talis Aspire api and see if there is a reading list for this id
		var getReadingLists=function() {
			aspire.url = "";
			// http://resourcelists.ed.ac.uk/isbn/0596000278/lists.json?cb=AspireCallBack
			// see http://support.talis.com/entries/20118736-Item-linking-API-specification
			if (aspire.isbn) {
				aspire.url = aspire.baseurl + 'isbn/' + aspire.isbn + aspire.urlsuffix;
			} else if (aspire.doi) {
				aspire.url = aspire.baseurl + 'doi/' + aspire.doi + aspire.urlsuffix;
			}
			// only connect to aspire if we actually have an isbn or doi
			if (aspire.url) {
				$.ajax({
				   type: 'GET',
					url: aspire.url,
					async: true,
					jsonpCallback: 'AspireCallBack',
					contentType: "application/json",
					dataType: 'jsonp',
					error: function(e) {
					   console.log(e.message);
					}
				});
				// Also add an option to bookmark this item in to Aspire
				// only if we haven't already added it, ie if they click 'details' tab more than once.
				console.log('aspire.detailstabid ' + aspire.detailstabid);
//				if ($(aspire.detailstabid + ' .EXLDetailsLinks ul:contains("Add to reading list")').length < 1) {
//					if (aspire.isbn) {
//						aspire.bookmarkurl = aspire.baseurl + "ui/forms/bookmarklet.html?rft.isbn=" + aspire.isbn;
//						$(aspire.detailstabid + ' .EXLDetailsLinks ul').append(	aspire.outputstringprefix + aspire.bookmarkurl + '" target="_blank">Add to reading list' + aspire.outputstringsuffix);
//					} else if(aspire.doi) {
//						aspire.bookmarkurl = aspire.baseurl + "ui/forms/bookmarklet.html?rft_id=info:doi/" + aspire.doi;
//						$(aspire.detailstabid + ' .EXLDetailsLinks ul').append(aspire.outputstringprefix + aspire.bookmarkurl + '">Add to reading list' + aspire.outputstringsuffix);
//					}
//				}
				
			}
		}
		
		// container function, to first get ISBNs, if any
		// if not try DOIs
		// and then call Aspire API.
		// to be called on page load, for a page showing one record.
		// and also when details tab is selected.
		var doAspireIntegration=function(cssid) {
			// if id doesn't exist. We may be on a page with one record,
			// where the id of the details tab button does not match the numbering
			// of the actual details tab content (grrrrrrr) so let us try and find it
			if (!$(cssid).length) {
				console.log('No Identifier called ' + cssid);
				// try and get id's under EXLDetailsContent
				// find one starting 
				aspire.altid = '#' + $("li[id^='Identifier']").prop('id');
				if ($(aspire.altid).length) {
					aspire.alttabnumber = aspire.altid.charAt(11);
					console.log('FINALLY using alt ' + aspire.alttabnumber);
					cssid = aspire.altid;
					aspire.detailstabid = '#exlidResult' + aspire.alttabnumber + '-TabContent';
				}
			}
			// if this is a page showing just one item, try and show lists asap.
			// as it defaults to Details tab
			getAspireISBNs(cssid);
			// if we didn't find an isbn, perhaps we might find a doi
			if (!aspire.isbn) {
				getAspireDOI(cssid);
			}
			getReadingLists();
		}
		
		// call the main function on page load - if we are displaying one record,
		// which defaults to the Details tab
		doAspireIntegration('#Identifier-1');

		
		// otherwise wait until the user clicks the details tab...
		// if user clicks on details tab, give it a sec to load and then go sniffing for ISBNS
		$('.EXLDetailsTab').click(function(){
    		var aspiredetailstab = {};
    		// get which details tab has been clicked....
    		aspiredetailstab.tabnumberid = $(this).prop('id');
			//
			// now get the number from that tab (exlidResult0-DetailsTab)
			aspiredetailstab.tabnumber = aspiredetailstab.tabnumberid.charAt(11);
			// now set a couple of identifiers based on the number
			// used to get isbn
			aspiredetailstab.identifierid = '#Identifier' + aspiredetailstab.tabnumber;
			// used to set the right links list (exlidResult0-TabContainer-detailsTab)
			aspiredetailstab.contentid = '#exlidResult' + aspiredetailstab.tabnumber + '-TabContent';
			
    		//console.log('tab num ' + aspiredetailstab.tabnumber);
			// tbh, these var names are damn confusing.
			aspire.detailstabid = aspiredetailstab.contentid;
			// we wait a sec for the Details tab to load...
			timeoutID = window.setTimeout(doAspireIntegration, 1000, aspiredetailstab.identifierid);
			
		});	


});