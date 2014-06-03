package ServerLogic.Messages;

import ServerApi.ApiResponseObject;

import java.util.LinkedList;
import java.util.List;

public abstract class MessageBase implements ApiResponseObject {
        
    public List<Integer> PlayerIDsToUpdate = new LinkedList<Integer>();
}
