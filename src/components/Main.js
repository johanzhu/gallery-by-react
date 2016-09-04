require('normalize.css/normalize.css');
require('styles/App.scss');


import React from 'react';
import ReactDOM from 'react-dom';
/*获取图片的相关数据*/
var imageDatas = require('../data/imageDatas.json');

/*利用自执行函数，将图片名信息转成图片URL路径信息*/
imageDatas=(function genImageURL(imageDatasArr){
	for(var i=0,j=imageDatasArr.length;i<j;i++){
		var singleImageData=imageDatasArr[i];
		
		singleImageData.imageURL=require('../images/'+singleImageData.fileName);
		
		imageDatasArr[i]=singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

//获取区间之内的一个随机值
function getRangeRandom(low,high){
	return Math.floor(Math.random() * (high - low) + low);
}
//获取0到30度之间任意一个正负值
function get30DegRandom(){
	return (Math.random() > 0.5 ? '':'-') + Math.ceil(Math.random() * 30);
}

class ImgFigure extends React.Component{
	 constructor(props) {
     super(props);
     this.handleClick = this.handleClick.bind(this);
   }
	 //封装点击的函数
     handleClick(e) {
	   if(this.props.arrange.isCenter){
	   	this.props.inverse();
	   } else {
	   	this.props.center();
	   }
	   e.stopPropagation();
	   e.preventDefault();
	   }
	   
	   render(){
	   	
	   	var styleObj = {};
	   	
	   	//如果props属性中指定了这张图片的位置，则使用
	   	if(this.props.arrange.pos){
	   		styleObj = this.props.arrange.pos;
	   	}
	   	
	   	//如果图片有旋转角度属性且不为0，添加图片的旋转
	   	if(this.props.arrange.rotate){
	   		(['moz','ms','webkit','']).forEach((value) => {/*在这个里面不需要加--*/
	   			styleObj[value + 'transform'] = 'rotate('+ this.props.arrange.rotate + 'deg)' ;
	   		});
	   	}
	   	
	   	if(this.props.arrange.isCenter){
	   		styleObj.zIndex = 11;
	   	}
	   	
	   	let imgFigureClassName = 'img-figure';
	   	    imgFigureClassName += this.props.arrange.isInverse?' is-inverse':'';
	   	return (
	   		 <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick} >
	   		  <img src={this.props.data.imageURL}
	   		             alt={this.props.data.title}
	   		   />
	   		  <figcaption>
	   		  <h2 className="img-title">{this.props.data.title}</h2>
	   		  <div className="img-back" onClick={this.handleClick}>
	   		  <p>
	   		  {this.props.data.desc}
	   		  </p>
	   		  </div>
	   		  </figcaption>
	   		  <div className='test'><input type='text' placeholder='test'/></div>
	   		 </figure>
	   		 
	   		 
	   	);
	   }
}

class AppComponent extends React.Component {
    constructor(props) {
    super(props);
  	this.Constant = {
  		centerPos: {/*中间区域*/
  		    left:0,
  		    top:0
  		},
  		hPosRange: {//水平方向取值的范围
  			leftSecX:[0,0],
  			rightSecX:[0,0],
  			y:[0,0]
  		},
  		vPosRange: {//垂直方向取值范围
  			x:[0,0],
  			topY:[0,0]
  		}
  		
  	};
  	this.state = {
  		
  			imgsArrangeArr:[
  			/*{
  				pos:{
  					left:'0',
  					top:'0'
  				    },
  				    rotate: 0, //旋转角度
  				    isInverse: flase//图片正反面
  				    isCenter:false//不居中
  			 }*/
  			]
  	};
}
    
    inverse(index) {
  		return () => {
  			let imgsArrangeArr = this.state.imgsArrangeArr;
  			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
  			
  			this.setState({
  				imgsArragenArr: imgsArrangeArr
  			})
  		}
  	}
  	
  	
  	rearrange(centerIndex){
  		let imgsArrangeArr = this.state.imgsArrangeArr,
  		    Constant = this.Constant,
  		    centerPos = Constant.centerPos,
  		    hPosRange = Constant.hPosRange,
  		    vPosRange = Constant.vPosRange,
  		    hPosRangeLeftSecX = hPosRange.leftSecX,
  		    hPosRangeRightSecX = hPosRange.rightSecX,
  		    hPosRangeY = hPosRange.y,
  		    vPosRangeTopY = vPosRange.topY,
  		    vPosRangeX = vPosRange.x,
  		    imgsArrangeTopArr = [],
  		    topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
  		    topImgSpliceIndex = 0,
  		    //首先居中 centerIndex 的图片
  		    imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
  		    imgsArrangeCenterArr[0] = {
  		    	pos: centerPos,
  		    	rotate: 0,
  		    	isCenter : true
  		    }
            /*并非注释不允许，在尾部打空格会报错，而且这个错误不容易被发现*/
  		    topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
  		    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
  		    
  		    //布局位于上侧的图片
  		    imgsArrangeTopArr.forEach((value,index) => {
  		    	 imgsArrangeTopArr[index] = {
  		    	 	pos: {
  		    	 	top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
  		    	 	left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
  		    	 	},
  		    	 	rotate : get30DegRandom(),
  		    	 	isCenter : false
  		    	 }
  		    });
  		    
  		    //布局左右两侧图片
  		    for(let i=0,j = imgsArrangeArr.length,k=j / 2;i<j;i++) {     /*length打错铸成大错*/
  		    	let hPosRangeLORX = null;
  		       //前半部分布局左边，右半部分布局右边
  		    	if(i < k) {
  		            hPosRangeLORX = hPosRangeLeftSecX;
  		    	} else {
  		    		hPosRangeLORX = hPosRangeRightSecX;
  		    	}
  		    	
  		    	imgsArrangeArr[i] = {
  		    		pos: {
  		    		top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
  		    		left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
  		    		},
  		    		rotate: get30DegRandom(),
  		    		isCenter : false
  		    	};
  		    }
  		    
  		    if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
  		    	imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0])
  		    }
  		    imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
  		    
  		    this.setState({
  		    	imgsArrangeArr : imgsArrangeArr
  		    });
  	}
  	
  	/*
  	 *利用rearrange函数 居中对应index的图片
  	 * @param index ,需要被居中的图片对应图片信息数组的index值
  	 */
  	center(index) {
  	    return () =>{
  	    this.rearrange(index);
  	       }
  	   }
  	
  	
  	/*组件加载后为每张图片计算器位置范围*/
  	componentDidMount(){
  		//首先拿到舞台的大小
  		let stageDom = ReactDOM.findDOMNode(this.refs.stage),
  		    stageW = stageDom.scrollWidth,
  		    stageH = stageDom.scrollHeight,
  		    
  		    halfStageW = Math.ceil(stageW / 2),
  		    halfStageH = Math.ceil(stageH / 2);
  		   
  		let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
  		    imgW = imgFigureDOM.scrollWidth,
  		    imgH = imgFigureDOM.scrollHeight,
  		    halfImgW = Math.ceil(imgW / 2),
  		    halfImgH = Math.ceil(imgH / 2);
  		    
  		/*计算中心图片的位置点    */
  		this.Constant.centerPos = {
  			left: halfStageW - halfImgW,
  			top: halfStageH - halfImgH
  		}
  		
  		//计算左侧右侧图片区域排布位置的取值范围
  		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
  		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
  		
  		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
  		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
  		
  		this.Constant.hPosRange.y[0] = -halfImgH;
  		this.Constant.hPosRange.y[1]= stageH - halfImgH;
  		
  		//计算上侧区域图片排布位置的取值范围
  		this.Constant.vPosRange.topY[0] = -halfImgH;
  		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
  		this.Constant.vPosRange.x[0] = halfStageW -imgW;
  		
  		this.Constant.vPosRange.x[1] = halfStageW;
  		let num = Math.floor(Math.random() * 10);
        this.rearrange(num);
  	}
  
  render() {/*render用于生产DOM*/
  	var controllerUnits = [],
  	      imgFigures = [];
  	      
      imageDatas.forEach((value,index) => {
      if(!this.state.imgsArrangeArr[index]){
      	this.state.imgsArrangeArr[index] = {
      		pos:{
      			left:0,
      			top:0
      		},
      		rotate : 0,
      		isInverse : false,
      		isCenter : false
      	}
      }
      
    	imgFigures.push(<ImgFigure ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} key={value.fileName} data={value} inverse={this.inverse(index)} center={this.center(index)}/>);/*这里调用了另外的组件IMGFIGURE，并且给了组件data，遍历的Imagedata实际上是json文件，json文件中的属性在IMGfure中可以被this.props.data来调用*/
    	
    });/*如此轻松- -加个value.fileName就解决了！果然value是数组，因为forEach默认的传入参数就是遍历对象！！*/
  	
    return (
       <section className='stage'>
             <section className="img-sec" ref="stage">
             {imgFigures}
              </section>
              <nav className="controller-nav">
              {controllerUnits}
              </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
