package ru.hlynov.oit.scanload.tools.files;


import com.atlassian.jira.issue.AttachmentError;
import com.atlassian.jira.issue.history.ChangeItemBean;
import com.atlassian.jira.web.util.AttachmentException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.net.URL;
import java.net.URLEncoder;

import com.atlassian.jira.component.ComponentAccessor;
import com.atlassian.jira.issue.AttachmentManager;
import com.atlassian.jira.issue.IssueManager;
import com.atlassian.jira.issue.Issue;
import com.atlassian.jira.user.util.UserManager;
import com.atlassian.jira.user.ApplicationUser;
import com.atlassian.jira.issue.attachment.CreateAttachmentParamsBean;
import com.atlassian.fugue.Either;

public class FileOps {

    private static final Logger log = LoggerFactory.getLogger(FileOps.class);

    public static String getFileFromRemoteServer(String url, String filename) {

        String filepath = null;

//        http://localhost/api/getfile.php?filename=

        try {
            File tempFile = File.createTempFile("att_load", "scanload");
            BufferedInputStream in = new BufferedInputStream(new URL(url + "?filename=" + URLEncoder.encode(filename, "UTF-8")).openStream());
            FileOutputStream fileOutputStream = new FileOutputStream(tempFile.getAbsolutePath());

            byte dataBuffer[] = new byte[1024];
            int bytesRead;
            while ((bytesRead = in.read(dataBuffer, 0, 1024)) != -1) {
                fileOutputStream.write(dataBuffer, 0, bytesRead);
            }

            filepath = tempFile.getAbsolutePath();

            log.warn(" ================= filepath");
            log.warn(filepath);

        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }

        return filepath;
    }


    public static boolean attachFileToIssue(String issueId, String username, String filename, String filepath) {

        IssueManager issueManager = ComponentAccessor.getIssueManager();
//        Issue issue = issueManager.getIssueByCurrentKey("TP-1"):
        Issue issue = issueManager.getIssueObject(issueId);

        UserManager userManager = ComponentAccessor.getUserManager();
        ApplicationUser user =  userManager.getUserByName(username);
        AttachmentManager attachmentManager = ComponentAccessor.getAttachmentManager();

        CreateAttachmentParamsBean.Builder builder = new CreateAttachmentParamsBean.Builder();
        builder.file(new File(filepath));
        builder.filename(filename);
//        builder.contentType("image/png");
        builder.author(user);
        builder.issue(issue);
        builder.copySourceFile(true);

        CreateAttachmentParamsBean bean = builder.build();
//        Either<AttachmentError, ChangeItemBean> result = attachmentManager.tryCreateAttachment(bean);
//
//        if (result.isLeft()) {
//            AttachmentError attachmentError = result.left().get();
//            log.error("AttachmentError '" + attachmentError.getLogMessage());
//            return false;
//        } else {
//            ChangeItemBean changeItemBean = result.right().get();
//            try {
//                attachmentManager.createAttachment(bean);
//            } catch (AttachmentException e) {
//                e.printStackTrace();
//                return false;
//            }
//            log.error("created!");
//        }


        try {
            attachmentManager.createAttachment(bean);
        } catch (AttachmentException e) {
            e.printStackTrace();
            return false;
        }

        return true;

    }


    public static void deleteTempFile(String filename) {
        File file = new File(filename);
        file.delete();
    }



}
