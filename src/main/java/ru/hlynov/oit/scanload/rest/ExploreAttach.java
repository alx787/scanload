package ru.hlynov.oit.scanload.rest;

import com.atlassian.plugins.rest.common.security.AnonymousAllowed;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;

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
        JsonArray jsonArray = new JsonArray();

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("name", "rc_display.json");
        jsonObject.addProperty("size", "272");
        jsonArray.add(jsonObject);

        return Response.ok(gson.toJson(jsonObject)).build();
    }
}