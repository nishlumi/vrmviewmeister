
#----------------------------------------------------
#  extract largef.zip
#  way of extract:
#    user: copy largef.zip VRMViewMeister/ directly.
#    this: unzip largef.zip
#    this: cd largef/
#    this: call deploy_largefile.bat
#
#----------------------------------------------------
zipFile="largef.zip"
unzipFolder="largef"

if [ -f "$zipFile" ]; then
    echo "Found $zipFile .Extract..."
    unzip "$zipFile" -d "$unzipFolder"
    echo "Extracted."
    echo "Next is copy to original directory."
    cp -r -f $unzipFolder/public .
    echo "Finished copy."
else
    "Not found $zipFile . "
fi