## Dockerizing IFA-ODATA-SVC
 Step 1: Create the Dockerfile 
  --- 
     command used: touch Dockerfile
   ---- 
 step 2: Build the docker image.
   ---
    command used: sudo docker build -t intelliflow/ifa-odata-svc --build-arg PROFILE=colo .
   ---
   step 3: Run the docker image.
   ----
    command used: sudo docker run -p 31513:31513 odata
     ---
     The above command starts the odata manager image inside the container and exposes port 31513 inside container to port 31513 outside the container.
     ----

   step 4: Check the image created.
   ---
    command used: docker images
   ---
 step 5:Access the route on server using http://localhost:31513