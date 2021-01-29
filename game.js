document.body.onclick = function(event) {
	let roolText = document.querySelector('#rool div');
	if (roolText.style.display == 'block') {
	roolText.style.display = 'none';
	} else{
	  if (event.target == document.getElementById('rool')){	
	  roolText.style.display = 'block';
	  }
	}
	
}
document.getElementById('start').onclick = start;

//функция начала игры
function start () {
	//очищаем содержимое контейнера и скрываем таблицу результатов предыдущей игры
	let container = document.getElementById('container');
	container.innerHTML = '';
	let listResult = document.getElementById('listResult');
	listResult.style.visibility = 'hidden';
	
	//обьявляем массивы:
	//карт игроков после раздачи
	let arrNord = [];
	let arrOst = [];
	let arrYou = [];
	let arrWest = [];
	//карт игроков забраных со стола
	let arrNordBet = [];
	let arrOstBet = [];
	let arrYouBet = [];
	let arrWestBet = [];
	//карт на столе после хода
	let arrBet = [];
	//карт на руках игроков в течение игры
	let arrNordClone = [];
	let arrOstClone = [];
	let arrYouClone = [];
	let arrWestClone = [];
	
    //создаем массив колоды карт и перемешиваем функцией shuffle
	let arr = [];
	let val = document.getElementById('val')
	let N = val.value;
	for (let i = 1; i<=N; i++) {
		arr.push(i);
	};
	
	function shuffle (arr) {
		for (let i = arr.length - 1; i>0; i--) {
			let j = Math.floor(Math.random()*(i+1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	};
	let startList = shuffle(arr);	

//создаем скрытую карту, ее размеры пригодятся в дальнейшем	
	let cardHidden = document.createElement('div');
	cardHidden.classList.add('card');
	cardHidden.style.visibility = 'hidden';
	container.append(cardHidden);

//создаем колоду карт (элементы)	
	for (let i = 1; i <= startList.length; i++) {
		let card = document.createElement('div');
		card.setAttribute('id', `card${i}`);
		card.classList.add('card');
		card.style.zIndex = startList[i-1];
		card.style.top = container.offsetHeight/2 - cardHidden.offsetHeight/2 - (startList[i-1])/2 + "px";
		card.style.left = container.offsetWidth/2 - cardHidden.offsetWidth/2 + (startList[i-1])/2 + "px";
		container.append(card);
	//создаем лицевую сторону
		let face = document.createElement('div');
		face.innerHTML = `<h3>${i}</h3><p>${i}</p>`;
		face.classList.add('face');
		card.append(face);
	//создаем обратную сторону
		let backface = document.createElement('div');
		backface.classList.add('backface');
		card.append(backface);
	};
	
    //раздаем колоду
	let promise = new Promise(function(resolve, reject) {
	for (let i = startList.length; i > 0; i--) {		
		setTimeout(function() {
		let namber = startList.indexOf(i) + 1;
		let card =  document.getElementById(`card${namber}`);
		if ((i)%4 == 0) {
		arrYou.push(namber);
		card.style.top = container.offsetHeight*0.76 + "px";
	    card.style.left = container.offsetWidth*0.22 + (Math.abs(i - startList.length)/4)*25 + "px";
		card.style.zIndex = Math.abs(i - startList.length)/4;
	    card.style.transform = 'rotateY(-180deg)';
	    };
	    if ((i)%4 == 3) {
	    arrWest.push(namber);
		card.style.top = container.offsetHeight*0.02 + (Math.abs(i + 1 - startList.length)/4)*15 + "px";
	    card.style.left = container.offsetWidth*0.02 + "px";
	    };
	    if ((i)%4 == 2) {
	    arrNord.push(namber);
		card.style.top = container.offsetHeight*0.02 + "px";
	    card.style.left = container.offsetWidth*0.22 + (Math.abs(i + 2 - startList.length)/4)*25 + "px";
	    };
	    if ((i)%4 == 1) {
	    arrOst.push(namber);
		card.style.top = container.offsetHeight*0.02 + (Math.abs(i + 3 - startList.length)/4)*15 + "px";
	    card.style.left = container.offsetWidth*0.82 + "px";
	    };
		if (i == 1) resolve();
        }, (startList.length-i)*80);		
	};	
	});
	
	//сортируем свои карты по возрастанию и назначаем прослушиватель события "клик" своего хода
	promise.then(function() {
	arrYou.sort((a, b) => a - b);
	for (let i = 0; i < arrYou.length; i++) {		
		let namber = arrYou[i];
		let card =  document.getElementById(`card${namber}`);		
		card.style.top = container.offsetHeight*0.76 + "px";
	    card.style.left = container.offsetWidth*0.22 + i*25 + "px";
		card.style.zIndex = i;	    
	    };

	arrNordClone = arrNord.slice();
	arrOstClone = arrOst.slice();
	arrYouClone = arrYou.slice();
	arrWestClone = arrWest.slice();

	container.addEventListener('click', yourStep);
	});
	
//функция своего хода и передачи другому
function yourStep (event) {
	let target = event.target;
	let elem = target.closest('.card');
	let ID = elem.getAttribute('id');	
	let currentNumber = +ID.slice(4);	
	if (arrYouClone.includes(currentNumber)) {		
		elem.style.top = container.offsetHeight*0.52 + "px";
        elem.style.left = container.offsetWidth*0.42 + "px";
        arrBet.push(currentNumber);
		arrYouClone = removeArrayItem(arrYouClone, currentNumber);
        container.removeEventListener('click', yourStep);
        if (arrBet.length == 4) {
              setTimeout(bet, 2000);
              } else {
             setTimeout(chose, 500, arrWestClone);
         };
    };
};


function removeArrayItem(arr, itemToRemove) {
	return arr.filter(item => item !== itemToRemove);
}
//функция выбора игроками карты и передачи хода
function chose (curArr) {
    	let curNum;
    	let choseArr = curArr.slice();
        if (arrBet.length == 0) {
        	curNum = curArr[Math.floor(Math.random()*(curArr.length))];
            } else {
           for (let item of arrBet) {
          	choseArr = choseArr.filter(elem => elem > item);			
              };			  
           if (choseArr.length) {
              curNum = choseArr[Math.floor(Math.random()*(choseArr.length))];
              } else {
              let choseArrClone = curArr.slice();
              choseArrClone.sort((a, b) => a - b);
              curNum = choseArrClone[0];			  
           };
        };
        let card = document.getElementById(`card${curNum}`);		
        if (curArr == arrWestClone) {
        	card.style.top = container.offsetHeight*0.42 + "px";
            card.style.left = container.offsetWidth*0.22 + "px";
			card.style.transform = 'rotateY(-180deg)';
            arrBet.push(+curNum);
            arrWestClone = removeArrayItem(curArr, curNum);
            if (arrBet.length == 4) {
              setTimeout(bet, 2000);
              } else {
              setTimeout(chose, 500, arrNordClone);
            };
         } else if (curArr == arrNordClone) {
        	card.style.top = container.offsetHeight*0.27 + "px";
            card.style.left = container.offsetWidth*0.42 + "px";
			card.style.transform = 'rotateY(-180deg)';
            arrBet.push(+curNum);
            arrNordClone = removeArrayItem(curArr, curNum);
            if (arrBet.length == 4) {
              setTimeout(bet, 2000);
              } else {
             setTimeout(chose, 500, arrOstClone);
            };
         } else if (curArr == arrOstClone) {
        	card.style.top = container.offsetHeight*0.42 + "px";
            card.style.left = container.offsetWidth*0.62 + "px";
			card.style.transform = 'rotateY(-180deg)';
            arrBet.push(+curNum);
            arrOstClone = removeArrayItem(curArr, curNum);
            if (arrBet.length == 4) {
              setTimeout(bet, 2000);
              } else {			 
              container.addEventListener('click', yourStep);              
            };
         };		 
};

//функция определения "чья взятка" и передачи хода
function bet () {
	arrBet.sort((a, b) => a - b);
	let winNum = arrBet[3];
	if (arrWest.includes(winNum)) {
		arrWestBet = arrWestBet.concat(arrBet);
		for (let item of arrBet) {
			let card = document.getElementById(`card${item}`);
			card.style.transform = "";
			card.style.top = container.offsetHeight*0.76 + "px";
			card.style.left = container.offsetWidth*0.02 + "px";
		};
		arrBet.length = 0;
		if (arrYouClone.length == 0) {
			winner()
			} else {
		   setTimeout(chose, 1000, arrWestClone);
		};
	} else if (arrNord.includes(winNum)) {
		arrNordBet = arrNordBet.concat(arrBet);
		for (let item of arrBet) {
			let card = document.getElementById(`card${item}`);
			card.style.transform = "";
			card.style.top = container.offsetHeight*0.02 + "px";
			card.style.left = container.offsetWidth*0.70 + "px";
		};
		arrBet.length = 0;
		if (arrYouClone.length == 0) {
			winner()
			} else {
		    setTimeout(chose, 1000, arrNordClone);
		};
	} else if (arrOst.includes(winNum)) {
		arrOstBet = arrOstBet.concat(arrBet);
		for (let item of arrBet) {
			let card = document.getElementById(`card${item}`);
			card.style.transform = "";
			card.style.top = container.offsetHeight*0.76 + "px";
			card.style.left = container.offsetWidth*0.82 + "px";
		};
		arrBet.length = 0;
		if (arrYouClone.length == 0) {
			winner()
			} else {
		    setTimeout(chose, 1000, arrOstClone);
		};
	} else if (arrYou.includes(winNum)) {
		arrYouBet = arrYouBet.concat(arrBet);
		for (let item of arrBet) {
			let card = document.getElementById(`card${item}`);
			card.style.transform = "";
			card.style.top = container.offsetHeight*0.76 + "px";
			card.style.left = container.offsetWidth*0.70 + "px";
		};
		arrBet.length = 0;
		if (arrYouClone.length == 0) {
			winner()
			} else {			
			container.addEventListener('click', yourStep);		    
		}
	};
};

//функция определения победителя		
function winner() {
	playResult = [
	          {
                 player:  'ВЫ',
                 score:    arrYouBet.length
              },
	          {
                 player:  'ВОСТОК',
                 score:    arrOstBet.length
              },
	          {
                 player:  'СЕВЕР',
                 score:    arrNordBet.length
              },
	          {
                 player:  'ЗАПАД',
                 score:    arrWestBet.length
               },
	              ];
	playResult.sort((a, b) => a.score - b.score);
	playResult.reverse();
	let tableResult = document.getElementById('tableResult');
	let i = 1;
	for (let elem of playResult) {
		tableResult.rows[i].cells[1].innerHTML = elem.player;
		tableResult.rows[i].cells[2].innerHTML = elem.score;
		i++;
	};	
	document.getElementById('win').innerHTML = `Победил:  ${playResult[0].player}`;
	listResult.style.top = document.body.offsetHeight/2 - listResult.offsetHeight/2 + "px";
	listResult.style.left = document.body.offsetWidth/2 - listResult.offsetWidth/2 + "px";
	listResult.style.visibility = 'visible';
	let close = document.querySelector('.close');
    close.onclick = function () {
	    listResult.style.visibility = "";
	};
	let newGame =  document.querySelector('.newGame');
	newGame.onclick = start;
}

}