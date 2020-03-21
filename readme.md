# ElectronR

## Running R from an ElectronJS application

The following steps will occur when the "Run Analysis" button is clicked:
- A csv file will be created with dummy data
- RScript.exe will be executed passing in the following parameters:
	- The path to the R file to execute
	- The directory where supplemental analysis files are located (e.g. data files)
	- The directory where temporary files are stored (e.g. the input csv file, the resulting output txt file and image file)
	- The path to the input file (csv format)
	- The path to the output file to be saved
- Read output file and display contents in app
- Load and display output image file and display in app

The R file executed performs the following:
- Reads in the arguments
- Installs R packages if not already installed (*ideally this is taken care of during initial install via Docker*)
- Loads R packages
- Reads in supplemental data file
- Reads in input data file
- Does magic analysis
- Writes output to a txt file and saves it to the temporary directory
- Generates a PNG image and saves it to the temporary directory

## Application Needs/Wants

- The application should not need to search for or ask for user input on the installation path of RScript.exe
- The application installation process should install a specific version of R (currently v3.6.2)
- The application installation process should install all required R packages for analysis, using the version of the package that is compatible with the installed version of R
- The application ideally can execute the RScript.exe command and analysis without needing user approval (bypass UAC on Windows, execute as sudo on Mac)
- The application and R file need to be able to read/write files to a temporary directory that can be accessed via the application
- The application needs to be able to open and save files (using standard File Dialog boxes) to the user's file system

## Docker

The application has been dockerised and can be built and run within a container.  
Assumptions: 
  - You have a local Docker machine. To install Docker please go [here](https://docs.docker.com/install/)
  - You have a Xserver locally which is a requirement for electron

### Notes

You might have to add the docker user allowed access to the Xserver
Error:
```
No protocol specified

(electron:15): Gtk-WARNING **: cannot open display: :0
```
Solution:
Run the following command of chec how to add your local or docker user to xhost
```
xhost +"local:docker@"
```
To run docker without sudo add your local use to the docker group or follow instracutions [here](https://github.com/sindresorhus/guides/blob/master/docker-without-sudo.md)

### Build Image

This builds and image named electronr
Run this command from within the root repository folder
```
docker build -t electronr .
```

### Run Image
This run the image named electronr
Run this command from within the root repository folder
```
docker run -it -v /tmp/.X11-unix:/tmp/.X11-unix -e DISPLAY=$DISPLAY --device /dev/snd electronr
```


