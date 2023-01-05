import { DBSchema } from "../../src/survey";

export const crf = {
  id: "0",
  type: "item",
  text: "Survey",
  items: [{
    id: "1",
    type: "item",
    text: "Folder",
    items: [{
      id: "2",
      type: "item",
      text:"Page",
      items:[
        {id:"4",type:"num",items:[],text:"number",layout:{style:"default"},options:{required:true,min:0,max:10,step:1,unit:"kg"}},
        {id:"5",type:"num",items:[],text:"slider",layout:{style:"range"},options:{required:true,min:10,max:100,step:10,unit:"m"}},
        {id:"6",type:"txt",items:[],text:"text",layout:{style:"default"},options:{required:true}},
        {id:"7",type:"select",items:[],text:"radio",layout:{style:"radio"},options:{required:true,select:[{text:"Radio 1",score:0},{text:"New Radio",score:2},{text:"Radio 2",score:1}]}},
        {id:"8",type:"select",items:[],text:"dropdown",layout:{style:"dropdown"},options:{required:true,select:[{text:"Radio 1",score:0},{text:"New Radio",score:2},{text:"Radio 2",score:1}]}},
        {id:"9",type:"item",items:[
          {id:"10",type:"check",items:[],text:"checkbox",layout:{style:"check"},options:{required:true}},
          {id:"11",type:"check",items:[],text:"switch",layout:{style:"switch"},options:{required:true}},
          {id:"12",type:"date",items:[],text:"date",options:{required:true}},
          {id:"13",type:"fn",items:[],text:"fn bmi",parameters:["4","5"],fnCompute:"BMI"}
        ],text:"section",layout:{style:"section"}}
      ],
      layout: {
        style: "card"
      }
    }]
  }]
} as DBSchema;

// export const crf = {"id":"0","type":"item","items":[{"id":"1","type":"item","items":[{"id":"2","type":"item","items":[{"id":"3","type":"item","items":[{"id":"4","type":"date","items":[],"text":"Data Ricovero","options":{"required":true}}],"text":"Ricovero","layout":{"style":"section"}},{"id":"5","type":"select","items":[],"text":"Provenienza","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"Urgente non da PS","score":0},{"text":"PS","score":1},{"text":"OBI, Medicina d'urgenza","score":2},{"text":"Altro reparto","score":3}]}}],"text":"Ricovero","layout":{"style":"card"}},{"id":"6","type":"item","items":[{"id":"7","type":"item","items":[{"id":"8","type":"date","items":[],"text":"Data di nascita","options":{"required":true}},{"id":"9","type":"num","items":[],"text":"Età","layout":{"style":"default"},"options":{"required":true,"min":0,"max":10,"step":1}},{"id":"10","type":"select","items":[],"text":"Sesso","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"M","score":0},{"text":"F","score":1}]}},{"id":"11","type":"select","items":[],"text":"Stato occupazionale","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"Non noto 1","score":0},{"text":"Pensionato","score":1},{"text":"Lavoratore","score":2},{"text":"Studente","score":3},{"text":"Disoccupato","score":4}]}},{"id":"12","type":"select","items":[],"text":"Residenza","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"Domicilio","score":0},{"text":"Struttura assistenziale","score":1}]}},{"id":"13","type":"select","items":[],"text":"Stato civile","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"Non noto","score":0},{"text":"Celibe/nubile","score":1},{"text":"Sposato/a","score":2},{"text":"Vedovo/a","score":3},{"text":"Divorziato/a","score":4},{"text":"Separato/a","score":5}]}},{"id":"14","type":"select","items":[],"text":"Caregiver","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"Non noto","score":0},{"text":"Si, aiuto completo","score":1},{"text":"Si, aiuto parziale","score":2},{"text":"No","score":3}]}},{"id":"15","type":"select","items":[],"text":"Scolarizzazione","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"Non noto","score":0},{"text":"Laurea (o post laurea)","score":1},{"text":"Diploma","score":2},{"text":"Licenza media","score":3},{"text":"Licenza elementare","score":4},{"text":"Nessuna","score":5}]}},{"id":"16","type":"select","items":[],"text":"Etnia","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"Non noto","score":0},{"text":"Caucasica","score":1},{"text":"Africa subsahariana","score":2},{"text":"Medio oriente e magreb","score":3},{"text":"Subcontinente indiano","score":4},{"text":"Estremo oriente","score":5}]}}],"text":"Caratteristiche socio-demografiche","layout":{"style":"section"}},{"id":"17","type":"item","items":[{"id":"18","type":"num","items":[],"text":"Altezza","layout":{"style":"default"},"options":{"required":true,"min":0,"max":10,"step":1}},{"id":"19","type":"num","items":[],"text":"Peso","layout":{"style":"default"},"options":{"required":true,"min":0,"max":10,"step":1}},{"id":"20","type":"num","items":[],"text":"Circonferenza addome","layout":{"style":"default"},"options":{"required":true,"min":0,"max":10,"step":1}},{"id":"21","type":"fn","items":[],"text":"BMI","parameters":["18","19"],"fnCompute":"BMI"}],"text":"Misure antropometriche","layout":{"style":"section"}}],"text":"Caratteristiche","layout":{"style":"card"}},{"id":"22","type":"item","items":[{"id":"23","type":"item","items":[{"id":"24","type":"select","items":[],"text":"Fumatore tabacco","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"si","score":0},{"text":"NO","score":1},{"text":"Ex","score":2}]}},{"id":"25","type":"num","items":[],"text":"Pacchi all'anno","layout":{"style":"default"},"options":{"required":true,"min":0,"max":10,"step":1}},{"id":"26","type":"select","items":[],"text":"Sigaretta elettronicha","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"Si","score":0},{"text":"No","score":1},{"text":"Ex","score":2}]}},{"id":"27","type":"select","items":[],"text":"Esposizione professionale a fumo passivo","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"Si","score":0},{"text":"No","score":1}]}}],"text":"Fumo","layout":{"style":"section"}},{"id":"28","type":"item","items":[{"id":"29","type":"select","items":[],"text":"Consumo di alcolici","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"Regolare","score":0},{"text":"Occasionale","score":1},{"text":"Assente","score":2}]}}],"text":"Alcol","layout":{"style":"section"}},{"id":"30","type":"item","items":[{"id":"31","type":"select","items":[],"text":"Diabete","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"Si","score":0},{"text":"No","score":1},{"text":"Non noto","score":2}]}},{"id":"32","type":"select","items":[],"text":"Malattie cardiovascolari","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"Si","score":0},{"text":"No","score":1},{"text":"Non noto","score":2}]}},{"id":"33","type":"select","items":[],"text":"Neoplasia","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"Si","score":0},{"text":"No","score":1},{"text":"Non noto","score":2}]}}],"text":"Familiarità","layout":{"style":"section"}},{"id":"34","type":"item","items":[{"id":"35","type":"select","items":[],"text":"Qualità del sonno","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"Regolare (> 7h))","score":0},{"text":"Insufficiente (< 7h)","score":1}]}},{"id":"36","type":"select","items":[],"text":"Insonnia","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"Difficoltà ad addormentarsi","score":0},{"text":"Risveglio precoce","score":1},{"text":"No","score":2}]}}],"text":"Sonno","layout":{"style":"section"}},{"id":"37","type":"item","items":[{"id":"38","type":"select","items":[],"text":"Ricovero ultimi 12 mesi","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"Si","score":0},{"text":"No","score":1},{"text":"Non noto","score":2}]}},{"id":"39","type":"num","items":[],"text":"Numero ricoveri","layout":{"style":"default"},"options":{"required":true,"min":0,"max":10,"step":1}},{"id":"40","type":"date","items":[],"text":"Data ultimo ricovero","options":{"required":true}},{"id":"41","type":"select","items":[],"text":"Ricovero in Medicina Interna","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"Si","score":0},{"text":"No","score":1}]}}],"text":"Ricoveri precedenti","layout":{"style":"section"}}],"text":"Fattori di Rischio","layout":{"style":"card"}}],"text":"Dati Pazienti"},{"id":"42","type":"item","items":[{"id":"43","type":"item","items":[{"id":"44","type":"item","items":[{"id":"45","type":"select","items":[],"text":"Patologie cardiache (solo cuore))","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"assente","score":0},{"text":"lieve","score":1},{"text":"moderato","score":2},{"text":"grave","score":3},{"text":"molto grave","score":4}]}},{"id":"46","type":"select","items":[],"text":"Ipertensione arteriosa","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"assente","score":0},{"text":"lieve","score":1},{"text":"moderato","score":2},{"text":"grave","score":3},{"text":"molto grave","score":4}]}},{"id":"47","type":"select","items":[],"text":"Patologie vascolari: sangue, vasi, midollo, milza, sistema linfatico","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"assente","score":0},{"text":"lieve","score":1},{"text":"moderato","score":2},{"text":"grave","score":3},{"text":"molto grave","score":4}]}},{"id":"48","type":"select","items":[],"text":"O.O.N.G.L.: occhio, orecchio, naso, gola, laringe","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"assente","score":0},{"text":"lieve","score":1},{"text":"moderato","score":2},{"text":"grave","score":3},{"text":"molto grave","score":4}]}},{"id":"49","type":"select","items":[],"text":"Apparato GI superiore: esofago, stomaco, duodeno, albero biliare, colecisti, pancreas","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"assente","score":0},{"text":"lieve","score":1},{"text":"moderato","score":2},{"text":"grave","score":3},{"text":"molto grave","score":4}]}},{"id":"50","type":"select","items":[],"text":"Apparato GI inferiore: intestino, ernie","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"assente","score":0},{"text":"lieve","score":1},{"text":"moderato","score":2},{"text":"grave","score":3},{"text":"molto grave","score":4}]}},{"id":"51","type":"select","items":[],"text":"Patologie epatiche (solo fegato)","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"assente","score":0},{"text":"lieve","score":1},{"text":"moderato","score":2},{"text":"grave","score":3},{"text":"molto grave","score":4}]}},{"id":"52","type":"select","items":[],"text":"Patologie renali (solo rene)","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"assente","score":0},{"text":"lieve","score":1},{"text":"moderato","score":2},{"text":"grave","score":3},{"text":"molto grave","score":4}]}},{"id":"53","type":"select","items":[],"text":"Altre patologie genito-urinarie: ureteri, vescica, uretra, prostata, genitali","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"assente","score":0},{"text":"lieve","score":1},{"text":"moderato","score":2},{"text":"grave","score":3},{"text":"molto grave","score":4}]}},{"id":"54","type":"select","items":[],"text":"Sistema muscolo-scheletro-cute: muscoli, scheletro, tegumenti","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"assente","score":0},{"text":"lieve","score":1},{"text":"moderato","score":2},{"text":"grave","score":3},{"text":"molto grave","score":4}]}},{"id":"55","type":"select","items":[],"text":"Patologie sistema nervoso centrale e periferico; non include la demenza","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"assente","score":0},{"text":"lieve","score":1},{"text":"moderato","score":2},{"text":"grave","score":3},{"text":"molto grave","score":4}]}},{"id":"56","type":"select","items":[],"text":"Patologie endocrine-metaboliche: include diabete, indezioni, stati tossici","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"assente","score":0},{"text":"lieve","score":1},{"text":"moderato","score":2},{"text":"grave","score":3},{"text":"molto grave","score":4}]}},{"id":"57","type":"select","items":[],"text":"Patologie psichiatriche-comportamentali: include demenza, depressione, ansia, psicosi","layout":{"style":"radio"},"options":{"required":true,"select":[{"text":"assente","score":0},{"text":"lieve","score":1},{"text":"moderato","score":2},{"text":"grave","score":3},{"text":"molto grave","score":4}]}}],"layout":{"style":"table"}}],"text":"CIRS","layout":{"style":"card"}}],"text":"Anamnesi"}],"text":"Survey"} as DBSchema;