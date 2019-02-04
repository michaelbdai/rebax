# Introduction to State Manager

## Key features
* State change during async action
* Automatically save server request data to state
* Support multi-stores
* Simplify the flow for server request
  component -> action -> state selector -> component
  no middleware, or reducer
* Experimental undo/redo (WIP)

## Next Step:
* Improve the shape of the state. Find a better way to present response data from state.
* Connect with redux dev-tool
* Implement redu/undo with partial state caching. Current, it keep record of the how state. Should just record the change.