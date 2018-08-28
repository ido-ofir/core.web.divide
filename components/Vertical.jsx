
var React = require('react');
var ReactDom = require('react-dom');
var PropTypes = require('prop-types');

var style = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  overflow: 'auto',
};
var boxStyle = {
  ...style,
  left: 0,
  right: 0
}

module.exports = {
  name: 'Vertical',
  dependencies: [
    'divide.VerticalLine'
  ],
  get(VerticalLine){
    return {
      propTypes: {
        ns: PropTypes.string,
        width: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ]),
        from: PropTypes.oneOf(['left', 'right']),
        disabled: PropTypes.bool
      },
      getInitialState(){
        var width;
        if(this.props.ns) width = localStorage.getItem(`${this.props.ns}.width`);
        this.width = width || this.props.width || '50%';
        this.isActive = false;
        return null;
      },
      componentDidMount(){
        this.el = this.refs.box;
        // window.addEventListener('mouseup', this.deactivate, false);
      },
      activate(){
        if(this.props.disabled) return;
        this.isActive = true;
      },
      deactivate(){
        this.isActive = false;
      },
      onMouseMove(e){
        if(!this.isActive){ return; }
        e.preventDefault();
        var width, left = e.nativeEvent.offsetX;
        var target = e.target;
        var from = this.props.from;
        while(target && (target !== this.el)){
          left += target.offsetLeft;
          target = target.parentElement;
        }
        if(from === 'right'){
          width = (this.el.clientWidth - left) + 'px';  // removed this.state.left :/
        }
        else if(from === 'left'){
          width = left + 'px';
        }
        else{
          width = ((left / this.el.clientWidth) * 100) + '%';
        }
        if(this.props.ns) localStorage.setItem(`${this.props.ns}.width`, width);
        this.width = width;
        this.moveLine(width);
      },
      moveLine(width){
        var el = this.el;
        var from = this.props.from;
        var leftElement = el.children[0];
        var lineElement = el.children[1];
        var rightElement = el.children[2];
        
        if(!from || from === 'left'){
          leftElement.style.width = width;
          lineElement.style.left = width;
          rightElement.style.left = width;
        }
        else{
          leftElement.style.right = width;
          lineElement.style.right = width;
          rightElement.style.width = width;
        }
      },
      renderLeft(width){
        var from = this.props.from;
        var leftStyle = {
            ...style,
            left: 0
        };
        if(!from || from === 'left'){
          leftStyle.width = width;
        }
        else{
          leftStyle.right = width;
        }
        // var child = this.props.children ? (this.props.children[0] || null) : null;
        return (
          <div style={ leftStyle }>
            { this.props.children[0] }
          </div>
        );
      },
      renderRight(width){
        var from = this.props.from;
        var rightStyle = {
            ...style,
            right: 0
        };
        if(from === 'right'){
          rightStyle.width = width;
        }
        else{
          rightStyle.left = width;
        }
        // var child = this.props.children ? (this.props.children[1] || null) : null;
        return (

          <div style={ rightStyle }>
            { this.props.children[1] }
          </div>
        );
      },
      renderLine(left, right){
        if(this.props.disabled) return null;
        return (
          <VerticalLine left={ left } right={ right } onMouseDown={ this.activate }/>
        );
      },
      render(){
        var left, right, width = this.width;
        if(this.props.from === 'right') right = width;
        else left = width;
        return (
          <div style={ boxStyle } onMouseMove={ this.onMouseMove } onMouseUp={ this.deactivate } ref="box">
            { this.renderLeft(width) }
            { this.renderLine(left, right) }
            { this.renderRight(width) }
          </div>
        );
      }
    };
  }
}
