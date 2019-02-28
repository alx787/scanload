package ru.hlynov.oit.scanload.rest;

import com.atlassian.plugins.rest.common.security.AnonymousAllowed;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.io.IOUtils;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.HttpResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;

import java.io.IOException;

/**
 * A resource of message.
 */
@Path("/scanload")
public class ExploreAttach {

    private static final Logger log = LoggerFactory.getLogger(ExploreAttach.class);


    @GET
//    @AnonymousAllowed
//    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML})
    @Produces({MediaType.APPLICATION_JSON})
    @Path("/getdirectorycontent")
    public Response getMessage()
    {
        Gson gson = new Gson();
//        JsonArray jsonArray = new JsonArray();
//
//        JsonObject jsonObject = new JsonObject();
//        jsonObject.addProperty("name", "rc_display.json");
//        jsonObject.addProperty("size", "272");
//        jsonArray.add(jsonObject);
//
//        jsonObject = new JsonObject();
//        jsonObject.addProperty("name", "fernflower.jar");
//        jsonObject.addProperty("size", "245371");
//        jsonArray.add(jsonObject);
//
//        jsonObject = new JsonObject();
//        jsonObject.addProperty("name", "Образец письма без логотипа (1).docx");
//        jsonObject.addProperty("size", "245371");
//        jsonArray.add(jsonObject);
//
//        jsonObject = new JsonObject();
//        jsonObject.addProperty("name", "rc_asm.json");
//        jsonObject.addProperty("size", "338");
//        jsonArray.add(jsonObject);
//
//        jsonObject = new JsonObject();
//        jsonObject.addProperty("name", "rclog.txt");
//        jsonObject.addProperty("size", "894");
//        jsonArray.add(jsonObject);
//
//        jsonObject = new JsonObject();
//        jsonObject.addProperty("name", "Необходимые+самостоятельные+доработки (1).doc");
//        jsonObject.addProperty("size", "122135");
//        jsonArray.add(jsonObject);
//
//        jsonObject = new JsonObject();
//        jsonObject.addProperty("name", "rc_blocks.json");
//        jsonObject.addProperty("size", "29");
//        jsonArray.add(jsonObject);
//
//        jsonObject = new JsonObject();
//        jsonObject.addProperty("name", "ОписаниеМодулейДжиры.doc");
//        jsonObject.addProperty("size", "23552");
//        jsonArray.add(jsonObject);
//
//        jsonObject = new JsonObject();
//        jsonObject.addProperty("name", "rc_cfr.json");
//        jsonObject.addProperty("size", "1628");
//        jsonArray.add(jsonObject);
//


        HttpClient client = HttpClientBuilder.create().build();
        HttpGet request = new HttpGet("http://localhost/api/getDirectoryContent.php");
        request.addHeader("accept", "application/json");

        HttpResponse response;

        try {
            response = client.execute(request);
        } catch (IOException e) {
            e.printStackTrace();
            return Response.status(Response.Status.SERVICE_UNAVAILABLE).build();
        }

        String jsonString = "[]";
        try {
            jsonString = IOUtils.toString(response.getEntity().getContent());
        } catch (IOException e) {
            e.printStackTrace();
            jsonString = "[]";
        }

//        if (jsonString == null) {
//            log.warn(" ================== no get json");
//        } else {
//            log.warn(jsonString);
//        }

        return Response.ok(jsonString).build();

    }
}