#commands for splitting in all directions
for record in [
  ['left',  'splitLeft' ]
  ['right', 'splitRight']
  ['up',    'splitUp'   ]
  ['down',  'splitDown' ]
] then do ([direc, method] = record) ->
  atom.commands.add 'atom-text-editor', "custom:split-#{direc}", ->

    # get cur pane
    curPane = atom.workspace.getActivePane()

    # split it and take new pane
    newPane = curPane?[method]()
    # if more than one item in pane
    console.log(curPane?.getItems()?.length)
    if curPane?.getItems()?.length > 1
      # move active item left
      curPane.moveItemToPane curPane.getActiveItem(), newPane
      console.log("if")
      # atom.commands.dispatch(atom.workspace.getActivePane(), 'pane:split-right-and-move-active-item')
    else # there is only 1 or 0 items, so just create new item
      console.log("else")
      console.log(atom.views.getView(newPane)?.dispatchEvent new CustomEvent('application:new-file'))
      # console.log(atom.commands.dispatch(atom.workspace.getActivePaneItem(), 'editor:indent'))

# TODO:
