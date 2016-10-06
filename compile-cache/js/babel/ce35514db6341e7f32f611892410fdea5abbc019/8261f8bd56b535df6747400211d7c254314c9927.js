Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _nivpagirWcView = require('./nivpagir-wc-view');

var _nivpagirWcView2 = _interopRequireDefault(_nivpagirWcView);

var _atom = require('atom');

'use babel';

exports['default'] = {

  nivpagirWcView: null,
  modalPanel: null,
  subscriptions: null,

  activate: function activate(state) {
    var _this = this;

    this.nivpagirWcView = new _nivpagirWcView2['default'](state.nivpagirWcViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.nivpagirWcView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new _atom.CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'nivpagir-wc:toggle': function nivpagirWcToggle() {
        return _this.toggle();
      }
    }));
  },

  deactivate: function deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.nivpagirWcView.destroy();
  },

  serialize: function serialize() {
    return {
      nivpagirWcViewState: this.nivpagirWcView.serialize()
    };
  },

  toggle: function toggle() {
    console.log('NivpagirWc was toggled!');
    return this.modalPanel.isVisible() ? this.modalPanel.hide() : this.modalPanel.show();
  }

};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL25pdi9naXRodWIvbml2cGFnaXItd2MvbGliL25pdnBhZ2lyLXdjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs4QkFFMkIsb0JBQW9COzs7O29CQUNYLE1BQU07O0FBSDFDLFdBQVcsQ0FBQzs7cUJBS0c7O0FBRWIsZ0JBQWMsRUFBRSxJQUFJO0FBQ3BCLFlBQVUsRUFBRSxJQUFJO0FBQ2hCLGVBQWEsRUFBRSxJQUFJOztBQUVuQixVQUFRLEVBQUEsa0JBQUMsS0FBSyxFQUFFOzs7QUFDZCxRQUFJLENBQUMsY0FBYyxHQUFHLGdDQUFtQixLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNwRSxRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDO0FBQzdDLFVBQUksRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRTtBQUN0QyxhQUFPLEVBQUUsS0FBSztLQUNmLENBQUMsQ0FBQzs7O0FBR0gsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQzs7O0FBRy9DLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO0FBQ3pELDBCQUFvQixFQUFFO2VBQU0sTUFBSyxNQUFNLEVBQUU7T0FBQTtLQUMxQyxDQUFDLENBQUMsQ0FBQztHQUNMOztBQUVELFlBQVUsRUFBQSxzQkFBRztBQUNYLFFBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDMUIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM3QixRQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQy9COztBQUVELFdBQVMsRUFBQSxxQkFBRztBQUNWLFdBQU87QUFDTCx5QkFBbUIsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRTtLQUNyRCxDQUFDO0dBQ0g7O0FBRUQsUUFBTSxFQUFBLGtCQUFHO0FBQ1AsV0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ3ZDLFdBQ0UsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsR0FDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsR0FDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FDdEI7R0FDSDs7Q0FFRiIsImZpbGUiOiIvaG9tZS9uaXYvZ2l0aHViL25pdnBhZ2lyLXdjL2xpYi9uaXZwYWdpci13Yy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgTml2cGFnaXJXY1ZpZXcgZnJvbSAnLi9uaXZwYWdpci13Yy12aWV3JztcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIG5pdnBhZ2lyV2NWaWV3OiBudWxsLFxuICBtb2RhbFBhbmVsOiBudWxsLFxuICBzdWJzY3JpcHRpb25zOiBudWxsLFxuXG4gIGFjdGl2YXRlKHN0YXRlKSB7XG4gICAgdGhpcy5uaXZwYWdpcldjVmlldyA9IG5ldyBOaXZwYWdpcldjVmlldyhzdGF0ZS5uaXZwYWdpcldjVmlld1N0YXRlKTtcbiAgICB0aGlzLm1vZGFsUGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHtcbiAgICAgIGl0ZW06IHRoaXMubml2cGFnaXJXY1ZpZXcuZ2V0RWxlbWVudCgpLFxuICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICB9KTtcblxuICAgIC8vIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIC8vIFJlZ2lzdGVyIGNvbW1hbmQgdGhhdCB0b2dnbGVzIHRoaXMgdmlld1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ25pdnBhZ2lyLXdjOnRvZ2dsZSc6ICgpID0+IHRoaXMudG9nZ2xlKClcbiAgICB9KSk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLm1vZGFsUGFuZWwuZGVzdHJveSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgdGhpcy5uaXZwYWdpcldjVmlldy5kZXN0cm95KCk7XG4gIH0sXG5cbiAgc2VyaWFsaXplKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuaXZwYWdpcldjVmlld1N0YXRlOiB0aGlzLm5pdnBhZ2lyV2NWaWV3LnNlcmlhbGl6ZSgpXG4gICAgfTtcbiAgfSxcblxuICB0b2dnbGUoKSB7XG4gICAgY29uc29sZS5sb2coJ05pdnBhZ2lyV2Mgd2FzIHRvZ2dsZWQhJyk7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMubW9kYWxQYW5lbC5pc1Zpc2libGUoKSA/XG4gICAgICB0aGlzLm1vZGFsUGFuZWwuaGlkZSgpIDpcbiAgICAgIHRoaXMubW9kYWxQYW5lbC5zaG93KClcbiAgICApO1xuICB9XG5cbn07XG4iXX0=
//# sourceURL=/home/niv/github/nivpagir-wc/lib/nivpagir-wc.js
