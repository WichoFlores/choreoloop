
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getRoutines, deleteRoutine } from "@/services/storageService";
import { Routine } from "@/models/types";
import RoutineCard from "@/components/RoutineCard";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Routines = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    const savedRoutines = getRoutines();
    setRoutines(savedRoutines);
  }, []);

  const handleDeleteRoutine = (id: string) => {
    deleteRoutine(id);
    setRoutines(routines.filter(routine => routine.id !== id));
    toast({
      title: "Routine deleted",
      description: "Your routine has been successfully deleted.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Dance Routines</h1>
            <Link to="/create">
              <Button className="bg-gradient-dance hover:opacity-90 transition-opacity">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Routine
              </Button>
            </Link>
          </div>

          {routines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routines.map((routine) => (
                <RoutineCard 
                  key={routine.id} 
                  routine={routine} 
                  onDelete={handleDeleteRoutine} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed border-muted">
              <h3 className="text-xl font-medium mb-2">No routines yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first routine to start practicing more effectively.
              </p>
              <Link to="/create">
                <Button className="bg-gradient-dance hover:opacity-90 transition-opacity">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Routine
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Routines;
