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
