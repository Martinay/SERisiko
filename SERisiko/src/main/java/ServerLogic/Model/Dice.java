/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package ServerLogic.Model;

import ServerApi.ApiResponseObject;
import java.util.HashMap;

/**
 *
 * @author nerv
 */
public class Dice implements ApiResponseObject {
    
    public int value;
    public String type;
    
    
    public <String, Object> HashMap getResponseData() {

        HashMap apiData = new HashMap();
        
        apiData.put("value", value);
        apiData.put("type", type);

        return apiData;
    }
}
